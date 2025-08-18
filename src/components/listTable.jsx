
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const rows = [
  {
    createdAt: '13/04/25 20:56',
    id: '00003',
    title: 'Rede lenta',
    description: 'Instalação de Rede',
    client: { initials: 'AC', name: 'André Costa' },
    technician: { initials: 'CS', name: 'Carlos Silva' },
    status: { label: 'Em espera', color: '#F8D7DA', text: '#D7263D' },
  },
  {
    createdAt: '12/04/25 15:20',
    id: '00004',
    title: 'Backup não está funcionando',
    description: 'Recuperação de Dados',
    client: { initials: 'AC', name: 'André Costa' },
    technician: { initials: 'CS', name: 'Carlos Silva' },
    status: { label: 'Em espera', color: '#F8D7DA', text: '#D7263D' },
  },
  {
    createdAt: '12/04/25 09:01',
    id: '00001',
    title: 'Computador não liga',
    description: 'Manutenção de Hardware',
    client: { initials: 'AS', name: 'Aline Souza' },
    technician: { initials: 'CS', name: 'Carlos Silva' },
    status: { label: 'Em atendimento', color: '#E3EAFD', text: '#2E3DA3' },
  },
  {
    createdAt: '10/04/25 10:15',
    id: '00002',
    title: 'Instalação de software de gestão',
    description: 'Suporte de Software',
    client: { initials: 'JM', name: 'Julia Maria' },
    technician: { initials: 'AO', name: 'Ana Oliveira' },
    status: { label: 'Encerrado', color: '#E6F4EA', text: '#3BA55D' },
  },
  {
    createdAt: '11/04/25 15:16',
    id: '00005',
    title: 'Meu fone não conecta no computador',
    description: 'Suporte de Software',
    client: { initials: 'SM', name: 'Suzane Moura' },
    technician: { initials: 'AO', name: 'Ana Oliveira' },
    status: { label: 'Encerrado', color: '#E6F4EA', text: '#3BA55D' },
  },
];

function Avatar({ initials }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: '#2E3DA3',
      color: '#fff',
      fontWeight: 600,
      fontSize: 14,
      marginRight: 8,
    }}>{initials}</span>
  );
}

export default function ListTable() {
  return (
    <TableContainer component={Paper} className="calls-admin-table" style={{ boxShadow: '0 2px 8px rgba(44,62,80,0.04)', borderRadius: 14 }}>
      <Table sx={{ minWidth: 900 }} aria-label="tabela de chamados">
        <TableHead>
          <TableRow>
            <TableCell style={{ color: '#2E3DA3', fontWeight: 600 }}>Criado em</TableCell>
            <TableCell style={{ color: '#2E3DA3', fontWeight: 600 }}>Id</TableCell>
            <TableCell style={{ color: '#2E3DA3', fontWeight: 600 }}>Título e Descrição</TableCell>
            <TableCell style={{ color: '#2E3DA3', fontWeight: 600 }}>Cliente</TableCell>
            <TableCell style={{ color: '#2E3DA3', fontWeight: 600 }}>Técnico</TableCell>
            <TableCell style={{ color: '#2E3DA3', fontWeight: 600 }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>
                <span style={{ fontWeight: 600 }}>{row.title}</span>
                <br />
                <span style={{ color: '#888', fontSize: 13 }}>{row.description}</span>
              </TableCell>
              <TableCell>
                <Avatar initials={row.client.initials} />
                {row.client.name}
              </TableCell>
              <TableCell>
                <Avatar initials={row.technician.initials} />
                {row.technician.name}
              </TableCell>
              <TableCell>
                <span style={{
                  background: row.status.color,
                  color: row.status.text,
                  borderRadius: 16,
                  padding: '4px 16px',
                  fontWeight: 500,
                  fontSize: 13,
                  display: 'inline-block',
                }}>{row.status.label}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}