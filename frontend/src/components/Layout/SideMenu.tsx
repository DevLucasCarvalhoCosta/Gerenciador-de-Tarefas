import React from 'react';
import { Drawer, Menu } from 'antd';
import { AppstoreOutlined, PlusCircleOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import styles from '../../styles/SideMenu.module.css';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { key: 'kanban', label: 'Kanban', icon: <AppstoreOutlined /> },
  { key: 'tarefas', label: 'Criar Tarefas', icon: <PlusCircleOutlined /> },
  { key: 'outra-pagina', label: 'Outra Página', icon: <FileOutlined /> },
];

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const selectedKey = location.pathname.split('/')[1] || 'kanban';

  return (
    <Drawer
      title="Menu de Navegação"
      placement="left"
      onClose={onClose}
      open={open}
      className={theme === 'dark' ? styles.dark : styles.light}
      bodyStyle={{ padding: 0 }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => { navigate(`/${key}`); onClose(); }}
        items={menuItems}
        theme={theme}
      />
    </Drawer>
  );
};

export default SideMenu;
