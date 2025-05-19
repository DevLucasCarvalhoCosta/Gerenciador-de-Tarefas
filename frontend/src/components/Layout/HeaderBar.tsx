import React from 'react';
import { Layout, Button, Avatar, Space } from 'antd';
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';
import styles from '../../styles/HeaderBar.module.css';

const { Header } = Layout;

interface HeaderBarProps {
  onMenuClick: () => void;
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const greetingVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3, ease: 'easeOut' } }
};

const avatarVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const HeaderBar: React.FC<HeaderBarProps> = ({ onMenuClick }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className={isLight ? styles.lightHeader : styles.darkHeader}
    >
      <Space align="center">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className={styles.menuButton}
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={avatarVariants}
        >
          <Avatar className={styles.avatar} size="large">
            {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : '?'}
          </Avatar>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={greetingVariants}
          className={styles.greeting}
        >
          Olá, <strong>{usuario?.nome ?? 'Usuário'}</strong> <span role="img" aria-label="aceno">👋</span>
        </motion.div>
      </Space>

      <Space>
        <Button
          type="text"
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className={styles.themeButton}
        >
          {isLight ? '🌞' : '🌙'}
        </Button>
        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className={styles.logoutButton}
        >
          Sair
        </Button>
      </Space>
    </motion.div>
  );
};

export default HeaderBar;
