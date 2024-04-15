import unittest
from unittest.mock import patch

from server import Server

class TestServer(unittest.TestCase):
    def setUp(self):
        self.server = Server('Test Server', '12345')

    def test_init(self):
        self.assertEqual(self.server.name, 'Test Server')
        self.assertEqual(self.server.id, '12345')
        self.assertEqual(self.server.PATH, '')
        self.assertEqual(self.server.config, {})
        self.assertEqual(self.server.host, 'localhost')
        self.assertFalse(self.server.is_server_on)
        self.assertEqual(self.server.content, '')

    @patch('server.get_process_info')
    def test_init_with_host_and_path(self, mock_get_process_info):
        mock_get_process_info.return_value = 'running'
        server = Server('Test Server', '12345', host='example.com', path='/minecraft')
        self.assertEqual(server.host, 'example.com')
        self.assertEqual(server.PATH, '/minecraft')

    @patch('server.get_process_info')
    def test_init_with_existing_process(self, mock_get_process_info):
        mock_get_process_info.return_value = 'running'
        server = Server('Test Server', '12345')
        self.assertTrue(server.is_server_on)

    @patch('server.get_process_info')
    def test_init_with_non_existing_process(self, mock_get_process_info):
        mock_get_process_info.return_value = None
        server = Server('Test Server', '12345')
        self.assertFalse(server.is_server_on)

    def test_check_alive(self):
        self.server.check_alive()
        # Add assertions for the expected behavior of the check_alive method

if __name__ == '__main__':
    unittest.main()