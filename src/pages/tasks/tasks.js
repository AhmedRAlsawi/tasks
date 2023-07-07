import React, { useEffect, useState } from 'react';
import 'devextreme/data/odata/store';
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Lookup
  , Editing,
  Summary,
  TotalItem
} from 'devextreme-react/data-grid';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

export default function Task() {

  const [data, setData] = useState(JSON.parse(localStorage.getItem("products"))) || []

  const dataSource = new DataSource({
    store: new ArrayStore({
      data: data,
      key: 'ID',
    }),
  });

  /**
    * Adding new Row
    * @param {object} e new row created with its data
    * @returns {Array} temp array which was updated by the new object added
    */
  const newRow = (e) => {
    let temp = []
    if (data) {
      temp = [...data]
    }
    else {
      temp.push(e.data)
    }
    setData(temp)
  }

  /**
   * Editing Row by ID
   * @param {object} e Row Object
   * @returns {Array} temp array which was updated at elements Index
   */
  const editRow = (e) => {
    let index = data.findIndex(ele => ele.ID === e.key)
    let temp = [...data]
    temp[index] = e.oldData
    setData(temp)
  }


  /**
  * Deleting Row by ID
  * @param {object} e Row Object
  * @returns {Array} pre after removing the clicked row by it's ID
  */
  const deleteSingleRow = (e) => {
    setData(prev => {
      let newAfterDeleting = prev.filter(ele => ele.ID !== e.data.ID)
      if (newAfterDeleting.length === 0) localStorage.removeItem("products")
      return newAfterDeleting
    })
  }


  const dropDownOptions = [{
    ID: 0,
    Code: '111',
    Name: 'General Expenses',
  }, {
    ID: 1,
    Code: "A10",
    Name: 'Ahmed',
  }, {
    ID: 2,
    Code: "C200",
    Name: 'Bank',
  }]


  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(data))
  }, [data])

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Tasks</h2>

      <DataGrid
        showBorders={true}
        className={'dx-card wide-card'}
        dataSource={dataSource}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        onRowRemoved={deleteSingleRow}
        onRowUpdating={editRow}
        onRowInserted={newRow}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />
        <Editing
          mode="batch"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}
        />
        <Column
          caption={'ID'}
          name={'ID'}
          allowSorting={true}
          dataField={'ID'}
          width={150}
          allowEditing={false}
          hidingPriority={2} />
        <Column
          caption={'Code'}
          name={'Code'}
          dataField={'Code'}
        >
          <Lookup dataSource={dropDownOptions} valueExpr="ID" displayExpr="Code" />
        </Column>
        <Column
          caption={'Acc. Name'}
          name={'Acc. Name'}
          dataField={'accountName'}
        >
          <Lookup dataSource={dropDownOptions} valueExpr="ID" displayExpr="Name" />
        </Column>
        <Column
          alignment='left'
          dataField={'Debit'}
          caption={'Debit'}
          dataType={'number'}
          hidingPriority={6}
        />
        <Column
          alignment='left'
          allowSorting={true}
          caption={'Credit'}
          dataType={'number'}
          dataField={'Credit'}
          hidingPriority={5}
        >
        </Column>
        <Column
          dataField={'Notes'}
          caption={'Memo'}
          hidingPriority={1}
        />
        <Summary>
          <TotalItem
            column="Debit"
            summaryType="sum"
            displayFormat='Total Debit L.C: {0}'
            valueFormat='#0.00' />
          <TotalItem
            column="Credit"
            summaryType="sum"
            displayFormat='Total Credit: {0}'
            valueFormat="#0.00" />
        </Summary>
      </DataGrid>
    </React.Fragment>
  )
}


