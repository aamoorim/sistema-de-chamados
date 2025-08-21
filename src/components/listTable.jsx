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
    id: '00003',
    title: 'Rede rapidamente lenta',
    description: 'Instalação de cpu',
    client: { initials: 'AC', name: 'André lima' },
    technician: { initials: 'CS', name: 'Carlos Magno' },
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
    }}>{initials}</span>
  );
}

export default function ListTable() {
  const { search } = useSearch();
  const filteredRows = rows.filter(row =>
    row.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TableContainer component={Paper} style={{ borderRadius: 14, boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }}>
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
          {filteredRows.map((row) => (
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
