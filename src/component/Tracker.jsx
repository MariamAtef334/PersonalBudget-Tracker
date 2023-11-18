import React,{ useState, useEffect }  from 'react'
import '../styles/Tracker.css'
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineModeEdit } from "react-icons/md";
import { GiExpense,GiProfit } from "react-icons/gi";
import { TbLoadBalancer } from "react-icons/tb";
import {motion}from 'framer-motion'
const Tracker = () => {
    const [records, setRecords] = useState(JSON.parse(localStorage.getItem('expenseRecords'))||[]);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showSummary,setShowSummary]=useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const isValidDate = (dateString) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(dateString);
    };

  const toggleSummary=(event)=>{
    setShowSummary(!showSummary);
    event.preventDefault();
  }

    const handleAddRecord = (event) => {
      event.preventDefault();
      if (!amount || !category || !date || !isValidDate(date) || parseFloat(amount) <= 0) {
        alert('Please enter valid details.');
        return;
      }
      const newRecord = {
        id: Date.now(),
        amount,
        category,
        date,
        description,
      };
  
      setRecords([...records, newRecord]);
      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');
    
    };

    const handleDeleteRecord = (id) => {
      const updatedRecords = records.filter((record) => record.id !== id);
      setRecords(updatedRecords);
    };
    const handleEditRecord = (recordId) => {
        const selected = records.find((record) => record.id === recordId);
        setSelectedRecord(selected);
        setSelectedRecordId(recordId); 
        setAmount(selected.amount);
        setCategory(selected.category);
        setDate(selected.date);
        setDescription(selected.description);
      };
      
      const handleUpdateRecord = (event) => {
        
        if (!amount || !category || !date || !isValidDate(date) || parseFloat(amount) <= 0) {
          alert('Please enter valid details.');
          return;
        }
      event.preventDefault();
        const updatedRecords = records.map((record) => {
          if (record.id === selectedRecord.id) {
            return {
              ...record,
              amount,
              category,
              date,
              description,
            };
          }
          return record;
        });
      
        setRecords(updatedRecords);
        setSelectedRecord(null);
        setAmount('');
        setCategory('');
        setDate('');
        setDescription('');
        setSelectedRecordId(null);
      };
      
      useEffect(() => {
        const storedRecords = JSON.parse(localStorage.getItem('expenseRecords'));
        if (storedRecords) {
          setRecords(storedRecords);
        }
      }, []);
      
      useEffect(() => {
        localStorage.setItem('expenseRecords', JSON.stringify(records));
      }, [records]);
      
  
      const totalIncome = records
      .filter((record) => record.category === 'Income')
      .reduce((acc, record) => acc + parseFloat(record.amount), 0);
    
    const totalExpense = records
      .filter((record) => record.category === 'Expense')
      .reduce((acc, record) => acc + parseFloat(record.amount), 0);
    
    const balance = totalIncome - totalExpense;
  return (
    <div className='container'>
      <div className="row d-flex">
      <motion.h1  initial={{ y: -200 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
       className='p-3 mt-2'>Budget Tracker </motion.h1>
    <div className="col-lg-6 col-md-12 col-sm-12 ">
        
        <form className=' mb-3' >
        <input className=' mb-2'
          type="number"
          placeholder="Enter the amount"
          value={amount}
          name='amount'
          onChange={(e) => setAmount(e.target.value)}
        />
   
        <select className=' mb-2' value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
        </select>
  
        <input className=' mb-2'
         data-date-format="DD MMMM YYYY"
          type="date"
          placeholder="Enter date"
          value={date}
          name='date'
          onChange={(e) => setDate(e.target.value)}
        />
        <input className=' mb-2 '
          type="text"
          placeholder="Description"
          value={description}
          name='description'
          onChange={(e) => setDescription(e.target.value)}
        />
<div className='d-flex gap-5 '>
<motion.button  whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }} type="submit" className=' btn btn-success mt-4 fw-bold' onClick={selectedRecordId ? handleUpdateRecord : handleAddRecord}>{selectedRecord ? ' Update Data ' : ' Add Data '}</motion.button>
<motion.button whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }} className="btn  btn-success fw-bold mt-4 " onClick={toggleSummary}> Financial Summary</motion.button>
  </div>
      </form>
      </div>
      {records.length!=0?<>
<div className='table-container col-lg-6 col-md-12 col-sm-12'>

 <motion.table  initial={{ y: 1000 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", duration: 1 }} 
        whileHover={{
            scale: 1.1,
            transition: { type: "spring", duration: 0.1 },
        }} className=' summary-container '>
 <thead>
   <tr>
   <th>Amount</th>
     <th>Category</th>
     <th>Date</th>
     <th>Description</th>
     <th>Edit</th>
     <th>Delete</th>
   </tr>
 </thead>
 <tbody>
   {records.map((record) => (
     <tr key={record.id}>
      <td>{`$ ${record.amount}`}</td>
       <td>{record.category}</td>
      
       <td>{record.date.split('-').reverse().join('-')}</td>

       <td>{record.description}</td>
       <td>
         <motion.button  whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }} onClick={() => handleEditRecord(record.id)} className='btn btn-warning m-2'><MdOutlineModeEdit className='btns'/></motion.button>
       </td>
       <td>
         <motion.button  whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }} onClick={() => handleDeleteRecord(record.id)} className='btn btn-danger m-2'><MdDeleteOutline  className='btns'/></motion.button>
       </td>
     </tr>
   ))}
 </tbody>
</motion.table>
</div>
</> :'' } 
      </div>  

   <div className="row  mt-5 ">

     <motion.div className='col-lg-6 col-md-6 col-sm-12' initial={{ y: 1000 }} animate={{ y: 0 }} transition={{ type: "spring", duration: 1 }}>
 
  {showSummary && (
        <motion.div 
        initial={{ x: "150vw", transition: { type: "spring", duration: 2 } }}
        animate={{ x: 0, transition: { type: "spring", duration: 2 } }}
        whileHover={{
            scale: 1.1,
            transition: { type: "spring", duration: 0.1 },
        }}
        exit={{
            x: "-60vw",
            scale: [1, 0],
            transition: { duration: 0.5 },
            backgroundColor: "rgba(255,0,0,1)",
        }}
        className=" mt-3 financialsummary">
     <h2 className=' fw-bold summarycontent'>Your summary </h2>
     <div className='content'>
          <p className='summarycontent'><span className=' fw-bold summarycontent '><GiProfit/>  Total Income:</span> ${totalIncome}</p>
          <p  className='summarycontent'> <span className=' fw-bold summarycontent'><GiExpense/>  Total Expense:</span> ${totalExpense}</p>
          <p  className='summarycontent'> <span className=' fw-bold summarycontent'><TbLoadBalancer/>  Remaining Balance:</span> ${balance}</p>
          </div>
        </motion.div>
      )}

</motion.div>

       
        </div>


    
</div>

  )
}

export default Tracker