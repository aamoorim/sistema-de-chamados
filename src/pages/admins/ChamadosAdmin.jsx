import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './styles.scss';
import ListTable from "../../components/listTable";
import SearchBar from "../../components/search-bar";

function CallAdmin() {
  return (
    <>
      {/* O título será exibido na parte superior do AdminLayout */}
      <SearchBar />
      <div>
        <ListTable />
      </div>

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default CallAdmin;
