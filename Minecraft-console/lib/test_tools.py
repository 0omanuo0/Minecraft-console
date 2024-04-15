import os
import unittest

from tools import generate_tree

class TestGenerateTree(unittest.TestCase):
    def test_generate_tree(self):
        # Crear una estructura de directorios y archivos de prueba
        test_dir = '/tmp/test_dir'
        os.makedirs(test_dir, exist_ok=True)
        os.makedirs(os.path.join(test_dir, 'dir1'), exist_ok=True)
        os.makedirs(os.path.join(test_dir, 'dir2'), exist_ok=True)
        open(os.path.join(test_dir, 'file1.txt'), 'w').close()
        open(os.path.join(test_dir, 'file2.txt'), 'w').close()

        # Generar el árbol de directorios y archivos
        tree = generate_tree(test_dir, 'test_dir')

        # Verificar la estructura del árbol
        self.assertEqual(tree['rute'], test_dir)
        self.assertEqual(tree['name'], 'test_dir')
        self.assertCountEqual(tree['files'], ['file1.txt', 'file2.txt'])
        self.assertCountEqual(tree['dir'], [
            {'rute': os.path.join(test_dir, 'dir1'), 'files': [], 'dir': [], 'name': 'dir1'},
            {'rute': os.path.join(test_dir, 'dir2'), 'files': [], 'dir': [], 'name': 'dir2'}
        ])

        # Eliminar la estructura de directorios y archivos de prueba
        os.remove(os.path.join(test_dir, 'file1.txt'))
        os.remove(os.path.join(test_dir, 'file2.txt'))
        os.rmdir(os.path.join(test_dir, 'dir1'))
        os.rmdir(os.path.join(test_dir, 'dir2'))
        os.rmdir(test_dir)

if __name__ == '__main__':
    unittest.main()