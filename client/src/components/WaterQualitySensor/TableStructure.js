import React from 'react';
import Table from 'react-bootstrap/Table';

function TableStructure() {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Component</th>
          <th>Requirements</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Calcium</td>
          <td>No more than 100</td>
        </tr>
        <tr>
          <td>Potassium</td>
          <td>No more than 20</td>
        </tr>
        <tr>
          <td>Magnesium</td>
          <td>No more than 80</td>
        </tr>
        <tr>
          <td>Sodium</td>
          <td>No more than 50</td>
        </tr>
      </tbody>
    </Table>
  );
}

TableStructure.whyDidYouRender = true;
export default React.memo(TableStructure);
