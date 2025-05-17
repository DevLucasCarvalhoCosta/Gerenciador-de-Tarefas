import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Login.module.css';

interface LoginFormValues {
  email: string;
  senha: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', values);
      const { token, nome, id } = response.data;

      const usuario = { id, nome, email: values.email };

      login(usuario, token);

      // Redireciona para a página Kanban após login
      navigate('/kanban');
    } catch (err: any) {
      console.error(err);
      message.error('Credenciais inválidas ou erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['login-background']}>
      <div className={styles['login-card']}>
        <div className={styles['logo-inline']}>
          <img
            src="/logo-taskflow.png"
            alt="TaskFlow Logo"
            className={styles['logo-inline-img']}
          />
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Informe o e-mail ou usuário' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Usuário ou Email"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="senha"
            rules={[{ required: true, message: 'Informe a senha' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Senha"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className={styles['btn-login']}
            >
              ENTRAR
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
