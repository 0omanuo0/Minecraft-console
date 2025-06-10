import sqlite3
import os
import lib.server as server
import uuid

class Database:
    def __init__(self, db_name='minecraft.db', servers_path='Minecraft-console/data'):
        self.servers_path = servers_path
        self.db_name = db_name
        
        self.connection = sqlite3.connect(db_name)
        self.cursor = self.connection.cursor()
        # Check if the 'servers' table exists before creating tables
        self.cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='servers'")
        table_exists = self.cursor.fetchone()
        if not table_exists:
            self.create_tables()
            # find all server paths in the specified directory
            paths = [path for path in os.listdir(servers_path) if os.path.isdir(os.path.join(servers_path, path))]
            self.new_method(servers_path, paths)
            
    def get_connection(self):
        return sqlite3.connect(self.db_name)

    def new_method(self, servers_path, paths):
        for path in paths:
            mc = server.McServer(name=path, id=path, path=os.path.join(servers_path, path))
            prop = mc.config
            self.add_server(
                name=mc.name,
                ip=mc.host,
                port=prop.get("query.port", 25565),
                rcon_port=mc.rcon_port,
                path=mc.PATH,
                ram_max=getattr(mc, "ram_max", 1024),
                ram_min=getattr(mc, "ram_min", 512),
                auto_start=getattr(mc, "auto_start", 0),
                other_args=getattr(mc, "other_args", ''),
                target_executable=getattr(mc, "target_executable", 'server.jar'),
                uuid_value=getattr(mc, "uuid", None)
            )

    def create_tables(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS servers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT NOT NULL UNIQUE,
                    name TEXT NOT NULL,
                    ip TEXT NOT NULL,
                    port INTEGER NOT NULL,
                    rcon_port INTEGER DEFAULT 25575,
                    path TEXT NOT NULL,
                    ram_max INTEGER DEFAULT 1024,
                    ram_min INTEGER DEFAULT 512,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    auto_start BOOLEAN DEFAULT 0,
                    other_args TEXT DEFAULT '',
                    target_executable TEXT DEFAULT 'server.jar'
                )
            ''')
            conn.commit()


    def add_server(
        self, 
        name, 
        ip="0.0.0.0", 
        port=25565, 
        rcon_port=25575, 
        path="", 
        ram_max=1024, 
        ram_min=512, 
        auto_start=0, 
        other_args='', 
        target_executable='server.jar', 
        uuid=None
    ):
        if not uuid:
            uuid = str(uuid.uuid4())
        ip = ip if ip else "0.0.0.0"
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO servers (
                    uuid, name, ip, port, rcon_port, path, ram_max, ram_min, auto_start, other_args, target_executable
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                uuid, name, ip, port, rcon_port, path, ram_max, ram_min, auto_start, other_args, target_executable
            ))
            conn.commit()

    def get_servers(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM servers")
            return cursor.fetchall()

    def get_server_by_id(self, server_id):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM servers WHERE id=?", (server_id,))
            return cursor.fetchone()
    
    def update_server(
        self, 
        server_id, 
        name=None, 
        ip=None, 
        port=None, 
        rcon_port=None, 
        path=None, 
        ram_max=None, 
        ram_min=None, 
        auto_start=None, 
        other_args=None, 
        target_executable=None,
        uuid_value=None
    ):
        updates = []
        params = []
        
        if uuid_value:
            updates.append("uuid=?")
            params.append(uuid_value)
        if name:
            updates.append("name=?")
            params.append(name)
        if ip:
            updates.append("ip=?")
            params.append(ip)
        if port:
            updates.append("port=?")
            params.append(port)
        if rcon_port:
            updates.append("rcon_port=?")
            params.append(rcon_port)
        if path:
            updates.append("path=?")
            params.append(path)
        if ram_max is not None:
            updates.append("ram_max=?")
            params.append(ram_max)
        if ram_min is not None:
            updates.append("ram_min=?")
            params.append(ram_min)
        if auto_start is not None:
            updates.append("auto_start=?")
            params.append(auto_start)
        if other_args is not None:
            updates.append("other_args=?")
            params.append(other_args)
        if target_executable is not None:
            updates.append("target_executable=?")
            params.append(target_executable)
        
        if updates:
            query = f"UPDATE servers SET {', '.join(updates)}, updated_at=CURRENT_TIMESTAMP WHERE id=?"
            params.append(server_id)
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query, tuple(params))
                conn.commit()

    def delete_server(self, server_id):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM servers WHERE id=?", (server_id,))
            conn.commit()

    def get_server_by_uuid(self, uuid):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM servers WHERE uuid=?", (uuid,))
            return cursor.fetchone()


if __name__ == "__main__":
    db = Database()
    print("Database initialized and tables created if they did not exist.")