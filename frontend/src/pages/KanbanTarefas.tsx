import React, { useEffect, useState } from 'react';
import {
  Typography,
  Tag,
  message,
  Spin,
  Modal,
  Button,
  Input,
  Form,
  Select,
  Tooltip,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import styles from '../css/KanbanTarefas.module.css';

const { Title } = Typography;
const { Option } = Select;

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  prioridade?: 'baixa' | 'media' | 'alta';
}

// Mapear status para texto amigável
const statusLabels: Record<Tarefa['status'], string> = {
  pendente: 'Pendentes',
  em_andamento: 'Em Andamento',
  concluida: 'Concluídas',
};

const prioridadeColorMap = {
  alta: '#eb5a46',
  media: '#ffab4a',
  baixa: '#61bd4f',
};

const KanbanTarefas: React.FC = () => {
  const { token } = useAuth();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(false);
  const [prioridadeLoading, setPrioridadeLoading] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtros, setFiltros] = useState({
    pendente: '',
    em_andamento: '',
    concluida: '',
  });

  const [form] = Form.useForm();

  const buscarTarefas = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3001/api/tarefas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTarefas(res.data);
    } catch {
      message.error('Erro ao buscar tarefas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  const deletarTarefa = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/tarefas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Tarefa deletada com sucesso!');
      // Buscar novamente para garantir sincronização com backend
      buscarTarefas();
    } catch {
      message.error('Erro ao deletar tarefa');
    }
  };

  const atualizarStatus = async (tarefaId: number, novoStatus: Tarefa['status']) => {
    try {
      await axios.put(
        `http://localhost:3001/api/tarefas/${tarefaId}`,
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Status atualizado');
      buscarTarefas();
    } catch {
      message.error('Erro ao atualizar status');
      buscarTarefas();
    }
  };

  const atualizarPrioridade = async (tarefaId: number, novaPrioridade: Tarefa['prioridade']) => {
    setPrioridadeLoading(tarefaId);
    try {
      await axios.put(
        `http://localhost:3001/api/tarefas/${tarefaId}`,
        { prioridade: novaPrioridade },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Prioridade atualizada');
      buscarTarefas();
    } catch {
      message.error('Erro ao atualizar prioridade');
      buscarTarefas();
    } finally {
      setPrioridadeLoading(null);
    }
  };

  const prioridadeToNum = (p?: Tarefa['prioridade']) => {
    if (p === 'alta') return 3;
    if (p === 'media') return 2;
    if (p === 'baixa') return 1;
    return 0;
  };

  // Separar tarefas por status
  const colunas: Record<Tarefa['status'], Tarefa[]> = {
    pendente: [],
    em_andamento: [],
    concluida: [],
  };

  Object.entries(colunas).forEach(([statusKey]) => {
    colunas[statusKey as Tarefa['status']] = tarefas
      .filter(
        t =>
          t.status === statusKey &&
          t.titulo.toLowerCase().includes(filtros[statusKey as keyof typeof filtros].toLowerCase())
      )
      .sort((a, b) => prioridadeToNum(b.prioridade) - prioridadeToNum(a.prioridade));
  });

  const onCreate = async (values: { titulo: string; descricao: string }) => {
    try {
      await axios.post(
        'http://localhost:3001/api/tarefas',
        { ...values, status: 'pendente', prioridade: 'baixa' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Tarefa criada com sucesso!');
      form.resetFields();
      setModalVisible(false);
      buscarTarefas();
    } catch {
      message.error('Erro ao criar tarefa');
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const tarefaId = Number(draggableId);
    const novoStatus = destination.droppableId as Tarefa['status'];

    atualizarStatus(tarefaId, novoStatus);
  };

  return (
    <div className={styles['app-container']}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24, color: '#172b4d' }}>
        Quadro de Tarefas
      </Title>

      {loading ? (
        <Spin tip="Carregando tarefas..." style={{ display: 'block', marginTop: 100 }} />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            style={{
              display: 'flex',
              gap: 20,
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflowX: 'auto',
              paddingBottom: 24,
            }}
          >
            {(['pendente', 'em_andamento', 'concluida'] as const).map(statusKey => (
              <Droppable droppableId={statusKey} key={statusKey}>
                {(provided, snapshot) => (
                  <section
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={styles['kanban-column']}
                    aria-label={`Coluna ${statusLabels[statusKey]}`}
                  >
                    <h4>{statusLabels[statusKey]}</h4>

                    <Input.Search
                      placeholder={`Buscar em ${statusLabels[statusKey]}...`}
                      allowClear
                      onChange={e =>
                        setFiltros(prev => ({
                          ...prev,
                          [statusKey]: e.target.value,
                        }))
                      }
                      value={filtros[statusKey]}
                      size="middle"
                      enterButton={
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: '#0B2D5E',
                            borderRadius: '6px',
                            border: 'none',
                            color: '#fff',
                            padding: '0 10px',
                            height: '32px',
                          }}
                          aria-label={`Buscar em ${statusLabels[statusKey]}`}
                        >
                          Buscar
                        </Button>
                      }
                    />

                    {statusKey === 'pendente' && (
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => setModalVisible(true)}
                        block
                        className={styles['kanban-new-task-btn']}
                      >
                        Nova Tarefa
                      </Button>
                    )}

                    {colunas[statusKey].map((tarefa, index) => (
                      <Draggable
                        key={tarefa.id}
                        draggableId={tarefa.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <article
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${styles['kanban-card']} ${
                              snapshot.isDragging ? styles.dragging : ''
                            }`}
                            role="listitem"
                            aria-roledescription="Tarefa arrastável"
                            aria-label={`${tarefa.titulo} - prioridade ${
                              tarefa.prioridade ?? 'baixa'
                            }`}
                            style={provided.draggableProps.style}
                          >
                            <div style={{ flex: 1, paddingRight: 12 }}>
                              <strong style={{ wordBreak: 'break-word' }}>{tarefa.titulo}</strong>
                              <p style={{ whiteSpace: 'pre-wrap', marginTop: 6, marginBottom: 0 }}>
                                {tarefa.descricao}
                              </p>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  marginTop: 8,
                                }}
                              >
                                {/* Tag visual da prioridade */}
                                <Tag
                                  color={prioridadeColorMap[tarefa.prioridade ?? 'baixa']}
                                  style={{
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    textTransform: 'uppercase',
                                    padding: '0 12px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    userSelect: 'none',
                                  }}
                                >
                                  {tarefa.prioridade?.toUpperCase() ?? 'BAIXA'}
                                </Tag>

                                {/* Select para Prioridade */}
                                <Tooltip title="Selecione a prioridade da tarefa">
                                  <Select
                                    value={tarefa.prioridade ?? 'baixa'}
                                    onChange={novaPrioridade => atualizarPrioridade(tarefa.id, novaPrioridade)}
                                    style={{ width: 120 }}
                                    disabled={prioridadeLoading === tarefa.id}
                                    dropdownMatchSelectWidth={false}
                                    optionLabelProp="label"
                                  >
                                    <Option value="alta" label="Alta">
                                      <Tag color={prioridadeColorMap.alta}>Alta</Tag>
                                    </Option>
                                    <Option value="media" label="Média">
                                      <Tag color={prioridadeColorMap.media}>Média</Tag>
                                    </Option>
                                    <Option value="baixa" label="Baixa">
                                      <Tag color={prioridadeColorMap.baixa}>Baixa</Tag>
                                    </Option>
                                  </Select>
                                </Tooltip>

                                {prioridadeLoading === tarefa.id && <Spin size="small" />}
                              </div>
                            </div>

                            <Button
                              type="default"
                              onClick={() => {
                                Modal.confirm({
                                  title: 'Confirma exclusão?',
                                  content: `Deseja realmente excluir a tarefa "${tarefa.titulo}"?`,
                                  okText: 'Sim',
                                  okType: 'danger',
                                  cancelText: 'Não',
                                  className: 'custom-ant-modal-confirm',
                                  okButtonProps: {
                                    style: {
                                      backgroundColor: '#d4380d',
                                      borderColor: '#d4380d',
                                      color: '#fff',
                                      minWidth: '96px',
                                      height: '36px',
                                      fontWeight: '600',
                                      borderRadius: '6px',
                                    },
                                  },
                                  cancelButtonProps: {
                                    style: {
                                      minWidth: '96px',
                                      height: '36px',
                                      borderRadius: '6px',
                                      fontWeight: '600',
                                      color: '#000',
                                      backgroundColor: '#f0f0f0',
                                      border: '1px solid #d9d9d9',
                                    },
                                  },
                                  onOk() {
                                    deletarTarefa(tarefa.id);
                                  },
                                });
                              }}
                              className={styles['kanban-delete-icon']}
                              aria-label={`Excluir tarefa ${tarefa.titulo}`}
                              icon={<DeleteOutlined />}
                            />
                          </article>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </section>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}

      <Modal
        title="Criar Nova Tarefa"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Criar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={onCreate}>
          <Form.Item
            label="Título"
            name="titulo"
            rules={[{ required: true, message: 'Informe o título da tarefa' }]}
          >
            <Input placeholder="Título da tarefa" />
          </Form.Item>
          <Form.Item
            label="Descrição"
            name="descricao"
            rules={[{ required: true, message: 'Informe a descrição da tarefa' }]}
          >
            <Input.TextArea rows={3} placeholder="Descrição detalhada" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KanbanTarefas;
