import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Drawer, Menu, Avatar, Space } from 'antd';
import {
  MenuOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  PlusCircleOutlined,
  FileOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const menuItems = [
  { key: 'kanban', label: 'Kanban', icon: <AppstoreOutlined /> },
  { key: 'tarefas', label: 'Criar Tarefas', icon: <PlusCircleOutlined /> },
  { key: 'outra-pagina', label: 'Outra Página', icon: <FileOutlined /> },
];

const DashboardLayout: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [temaClaro, setTemaClaro] = useState(true); // tema inicial claro

  // Atualiza a classe no body para tema claro ou escuro
  useEffect(() => {
    if (temaClaro) {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }, [temaClaro]);

  const selectedKey = location.pathname.split('/')[1] || 'kanban';

  const onMenuClick = (key: string) => {
    navigate(`/${key}`);
    setDrawerVisible(false);
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        // background ajustado via CSS pelo tema
      }}
      className={temaClaro ? 'light-theme' : 'dark-theme'}
    >
      <Header
        style={{
          background: temaClaro ? '#fff' : '#222',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: temaClaro
            ? '0 1px 4px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          color: temaClaro ? '#172b4d' : '#eee',
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          aria-label="Abrir menu"
          style={{ fontSize: 22, color: temaClaro ? '#172b4d' : '#eee' }}
        />

        <Space align="center" style={{ flex: 1, justifyContent: 'center' }}>
          <Avatar size="large" style={{ backgroundColor: temaClaro ? '#005299' : '#444' }}>
            {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : '?'}
          </Avatar>
          <Title
            level={4}
            style={{
              margin: 0,
              color: temaClaro ? '#172b4d' : '#eee',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 'calc(100vw - 180px)',
            }}
            title={usuario?.nome}
          >
            Olá, {usuario?.nome ?? 'Usuário'} 👋
          </Title>
        </Space>

        {/* Botão alternar tema */}
        <Button
          type="text"
          onClick={() => setTemaClaro(!temaClaro)}
          aria-label="Alternar tema claro e escuro"
          style={{ fontSize: 22, marginRight: 16, color: temaClaro ? '#172b4d' : '#eee' }}
        >
          {temaClaro ? <BulbOutlined /> : <BulbFilled />}
        </Button>

        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={() => {
            logout();
            navigate('/login');
          }}
          aria-label="Sair"
          style={{ fontWeight: '600', color: temaClaro ? undefined : '#eee' }}
        >
          Sair
        </Button>
      </Header>

      <Drawer
        title={
          <Text strong style={{ fontSize: 18, color: temaClaro ? '#005299' : '#eee' }}>
            Menu de Navegação
          </Text>
        }
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        bodyStyle={{ padding: 0, backgroundColor: temaClaro ? '#fff' : '#333' }}
        maskClosable
        aria-label="Menu lateral de navegação"
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => onMenuClick(key)}
          items={menuItems}
          style={{
            height: '100%',
            borderRight: 0,
            backgroundColor: temaClaro ? '#fff' : '#333',
            color: temaClaro ? undefined : '#eee',
          }}
          theme={temaClaro ? 'light' : 'dark'}
        />
      </Drawer>

      <Content
        style={{
          margin: '24px 16px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: temaClaro ? '#f0f2f5' : '#222',
          padding: 24,
          borderRadius: 8,
          boxShadow: temaClaro
            ? '0 0 12px rgba(0,0,0,0.05)'
            : '0 0 12px rgba(255,255,255,0.05)',
          color: temaClaro ? undefined : '#eee',
          transition: 'all 0.3s ease',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default DashboardLayout;
