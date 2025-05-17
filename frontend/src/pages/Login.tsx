import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await login(values.email, values.senha);
    } catch (err) {
      message.error('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <div className="logo-inline">
          <img
            src="/logo-taskflow.png"
            alt="TaskFlow Logo"
            className="logo-inline-img"
          />
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Informe o ' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuário" />
          </Form.Item>
          <Form.Item
            name="senha"
            rules={[{ required: true, message: 'Informe a senha' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="btn-login"
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
