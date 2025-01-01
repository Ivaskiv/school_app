import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import MultiSelect from '../../selects/MultiSelect';
import style from './index.module.scss';
import { updateRelations } from '../redux/relationsSlice';
import SelectOptionsToText from '../../selects/SelectOptionsToText';
import EditCloseSelectButton from '../../selects/EditCloseSelectButton';

export default function EditableTable({ tableType = 'teachersSubjects' }) {
  const dispatch = useDispatch();

  const relations = useSelector(state => state.relations.relations || {});
  const teachers = useSelector(state => state.teachers.teachers || []);
  const classes = useSelector(state => state.classes.classes || []);
  const subjects = useSelector(state => state.subjects.subjects || []);
  console.log('teachers EditableTable', teachers);
  console.log('classes EditableTable', classes);
  console.log('subjects EditableTable', subjects);
  console.log('relations EditableTable', relations);

  const [editingCell, setEditingCell] = useState(null);

  const entitiesMap = useMemo(() => {
    switch (tableType) {
      case 'teachersSubjects':
        return {
          rows: teachers,
          columns: subjects,
          thirdEntity: classes,
          keys: ['teacherId', 'subjectId', 'classIds'],
        };
      case 'subjectsClasses':
        return {
          rows: subjects,
          columns: classes,
          thirdEntity: teachers,
          keys: ['subjectId', 'classId', 'teacherIds'],
        };
      case 'teachersClasses':
        return {
          rows: teachers,
          columns: classes,
          thirdEntity: subjects,
          keys: ['teacherId', 'classId', 'subjectIds'],
        };
      default:
        return { rows: [], columns: [], thirdEntity: [], keys: [] };
    }
  }, [tableType, teachers, subjects, classes]);

  const { rows, columns, keys, thirdEntity } = entitiesMap;
  const [rowKey, colKey, cellKey] = keys;

  const tableData = useMemo(() => {
    console.log('Generating table data...');
    return rows.map(row => {
      const rowData = { id: row.id, rowName: row.name };
      columns.forEach(col => {
        const relation = relations.find(rel => rel[rowKey] === row.id && rel[colKey] === col.id);
        rowData[col.id] = relation ? relation[cellKey] : [];
      });
      console.log('Row data:', rowData);
      return rowData;
    });
  }, [rows, columns, relations, rowKey, colKey, cellKey]);

  const tableColumns = useMemo(
    () => [
      { accessorKey: 'rowName', header: 'Name' },
      ...columns.map(column => ({
        accessorKey: String(column.id),
        header: column.name,
        cell: cell => renderEditableCell(cell),
      })),
    ],
    [columns, relations, editingCell]
  );

  const renderEditableCell = cell => {
    const rowId = cell.row.original.id;
    const colId = cell.column.id;
    console.log('Rendering editable cell for:', rowId, colId);

    const isEditing = editingCell?.rowId === rowId && editingCell?.colId === colId;

    const options = thirdEntity.map(item => ({
      value: item.id,
      label: item.name,
    }));
    // console.log('Available options:', options);

    const currentRelation = relations.find(
      rel => rel[rowKey] === rowId && rel[colKey] === Number(colId)
    );
    console.log('Current relation:', currentRelation);

    const selectedOptions = currentRelation
      ? currentRelation[cellKey].map(id => ({
          value: id,
          label: thirdEntity.find(entity => entity.id === id)?.name || '',
        }))
      : [];

    const handleEditToggle = () => {
      setEditingCell(prev =>
        prev?.rowId === rowId && prev?.colId === colId ? null : { rowId, colId }
      );
      console.log('Toggling edit state for:', rowId, colId);
    };

    const handleChange = selected => {
      console.log('Selected options:', selected);
      const selectedIds = selected.map(option => option.value);

      dispatch(
        updateRelations({
          matchKeys: [rowKey, colKey],
          data: { [rowKey]: rowId, [colKey]: Number(colId), [cellKey]: selectedIds },
        })
      );
      console.log('rowKey:', rowKey, 'colKey:', colKey, 'rowId:', rowId, 'colId:', colId);

      setEditingCell(null);
      console.log('Dispatching update with data:', {
        [rowKey]: rowId,
        [colKey]: Number(colId),
        [cellKey]: selectedIds,
      });
    };

    return (
      <div className={style.cellContainer}>
        <EditCloseSelectButton isEditing={isEditing} onToggleEdit={handleEditToggle} />
        {isEditing ? (
          <MultiSelect options={options} value={selectedOptions} onChange={handleChange} />
        ) : (
          <span className={style.optionsList}>
            <SelectOptionsToText selectedOptions={selectedOptions} />
          </span>
        )}
      </div>
    );
  };

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!rows || !columns || !cellKey) {
    return <p>No data available</p>;
  }

  return (
    <div className={style.tableContainer}>
      <table className={style.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={`row-${row.id}`}>
              {row.getVisibleCells().map(cell => (
                <td key={`cell-${row.id}-${cell.column.id}-${cell.getValue()}`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
