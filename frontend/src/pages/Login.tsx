import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; senha: string }) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', values);
      const { token } = res.data;

      localStorage.setItem('token', token);
      message.success('Login realizado com sucesso!');
      navigate('/tarefas');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '100px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <Title level={3} style={{ textAlign: 'center' }}>Login</Title>
      <Form name="login" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Informe seu e-mail!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="E-mail" />
        </Form.Item>

        <Form.Item
          name="senha"
          rules={[{ required: true, message: 'Informe sua senha!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
