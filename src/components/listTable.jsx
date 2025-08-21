// ✅ VERSÃO CORRIGIDA do seu ListTable.js

import { useSearch } from "../context/search-context";
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
    createdAt: '13/04/25 20:56',
    id: '00004', // Mudei o ID para ser único
    title: 'Rede rapidamente lenta',
    description: 'Instalação de cpu',
    client: { initials: 'AL', name: 'André lima' },
    technician: { initials: 'CM', name: 'Carlos Magno' },
    status: { label: 'Em espera', color: '#F8D7DA', text: '#D7263D' },
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
    }}>
      {initials}
    </span>
  );
}

export default function ListTable() {
  const { search, filters } = useSearch();

  const filteredRows = rows.filter(row => {
    const matchesSearch = search === '' || 
      row.title.toLowerCase().includes(search.toLowerCase()) ||
      row.description.toLowerCase().includes(search.toLowerCase()) ||
      row.client.name.toLowerCase().includes(search.toLowerCase()) ||
      row.technician.name.toLowerCase().includes(search.toLowerCase());

    const matchesFilters = Object.entries(filters).every(([filterType, values]) => {
      if (values.length === 0) return true;

      switch (filterType) {
        case 'status':
          return values.includes(row.status.label);
        case 'technician':
          return values.includes(row.technician.name);
        case 'client':
          return values.includes(row.client.name);
        case 'description':
          return values.some(value => 
            row.description.toLowerCase().includes(value.toLowerCase())
          );
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  return (
    <div>
      <div style={{ marginBottom: 16, color: '#666', fontSize: 14 }}>
        Mostrando {filteredRows.length} de {rows.length} chamados
      </div>

      <TableContainer 
        component={Paper} 
        style={{ borderRadius: 14, boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }}
      >
        <Table sx={{ minWidth: 900 }} aria-label="tabela de chamados">
          <TableHead>
            <TableRow>
              <TableCell style={{ color: '#858B99', fontWeight: 600 }}>Criado em</TableCell>
              <TableCell style={{ color: '#858B99', fontWeight: 600 }}>Id</TableCell>
              <TableCell style={{ color: '#858B99', fontWeight: 600 }}>Título e Descrição</TableCell>
              <TableCell style={{ color: '#858B99', fontWeight: 600 }}>Cliente</TableCell>
              <TableCell style={{ color: '#858B99', fontWeight: 600 }}>Técnico</TableCell>
              <TableCell style={{ color: '#858B99', fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
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
                    }}>
                      {row.status.label}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={6} 
                  style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#999' 
                  }}
                >
                  Nenhum chamado encontrado com os filtros aplicados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}