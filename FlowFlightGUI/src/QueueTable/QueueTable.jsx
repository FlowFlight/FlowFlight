import React, {useState} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
function Table(props){

    const [queue, setQueue] = useState(props.content);
    const [newScheduledTakeOff, setNewScheduledTakeOff] = useState("");
    const [newPriority, setNewPriority] = useState(0);
    const [newFlight, setNewFlight] = useState("");
    const [newAircraft, setNewAircraft] = useState("");
    const [newAirline, setNewAirline] = useState("");
    const [sortMethod, setSortMethod] = useState({ScheduledTakeOff: false, Priority:false, Flight:false, Aircraft: false, Airline: false });
    const [filterMethod, setFilterMethod] = useState("ScheduledTakeOff")
    let filter2=""
    const [filter, setFilter] = useState("")
    const [filterStatus, setFilterStatus] = useState(false)
    const [queuesFiltered, setqueuesFiltered] = useState(props.content);
    const [data, setData] = useState(null);
    const x = 0;

    function connectToPython()
    {
        axios.get('http://localhost:5000/api/data')
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the data!', error);
        });
    }
    function addqueue()
    {
        if(newScheduledTakeOff.trim()==="" || newPriority.trim() === "" || newFlight=== "" || newAircraft==="" || newAirline === "") return;
        let newqueue={name: newScheduledTakeOff, email: newPriority, date: newFlight, description: newAircraft, link: newAirline};
        setQueue(c => [...c, newqueue]);
        setNewScheduledTakeOff("");
        setNewPriority(0);
        setNewFlight("");
        setNewAircraft("");
        setNewAirline("");
    }

    function removequeue(index)
    {
        let updatedQueue = queue.filter((_,i)=>i!==index);
        setQueue(updatedQueue);
    }

    function moveUp(index)
    {
        if(index>0)
        {
            const updatedQueue = [...queue];
            [updatedQueue[index], updatedQueue[index-1]] = [updatedQueue[index-1], updatedQueue[index]];
            setQueue(updatedQueue);
        }
    }

    function moveDown(index)
    {
        if(index<queue.length-1)
        {
            const updatedqueues = [...queue];
            [updatedqueues[index+1], updatedqueues[index]] = [updatedqueues[index], updatedqueues[index+1]];
            setQueue(updatedqueues);
        }
    }
    function changeNewScheduledTakeOff(e)
    {
        setNewScheduledTakeOff(e.target.value);
    }
    function changeNewPriority(e)
    {
        setNewPriority(e.target.value);
    }
    function changeNewFlight(e)
    {
        setNewFlight(e.target.value);
    }
    function changeNewAircraft(e)
    {
        setNewAircraft(e.target.value);
    }
    function changeNewAirline(e)
    {
        setNewAirline(e.target.value);
    }
    function changeFilter(e)
    {
        filter2=e.target.value;
        setFilter(filter2)
        console.log(filter2)
        console.log(e.target.value)
        if(e.target.value.trim()==="") {
            setFilterStatus(false)
        }

        else {
            setFilterStatus(true)
        }
            updateFilteredQueue()
    }
    function changeFilterMethod(method)
    {
        setFilterMethod(method)
        setFilterStatus(false)
        filter2="";
        setFilter("")
        updateFilteredQueue()
    }

    function updateFilteredQueue()
    {
        const temp = queue.filter(c => c[filterMethod].toLowerCase().includes(filter2.toLowerCase()))
        setqueuesFiltered(temp)
    }
    function changeQueue(index, keyName,e)
    {
        let updatedqueues = [...queue];
        updatedqueues[index][keyName]=e.target.value;
        setQueue(updatedqueues);
    }

    function sort(keyName)
    {
        let asc;

        let temp=sortMethod;
        temp[keyName]=!temp[keyName]
        setSortMethod(temp);
        asc = temp[keyName];
        let updatedqueues = [...queue];
        if(asc) updatedqueues.sort((a,b) => a[keyName].localeCompare(b[keyName]));
        else updatedqueues.sort((a,b)=> b[keyName].localeCompare(a[keyName]))
        setQueue(updatedqueues);
    }

    function convertArrayOfObjectsToCSV(data) {
        let csv = '';
        // Extract headers
        const headers = Object.keys(data[0]);
        csv += headers.join(',') + '\n';
    
        // Extract values
        data.forEach(item => {
            const row = headers.map(header => {
                const value = item[header];
                // If the value contains a comma, enclose it in double quotes
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value;
            });
            csv += row.join(',') + '\n';
        });
    
        return csv;
    }
    
    function downloadCSV(data, filename) {
        const csv = convertArrayOfObjectsToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // For IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    function downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        if (navigator.msSaveBlob) { // For IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    return(
            <div className="queueContainer">
                <h1 className="mainheader">Aircraft Queue Manager - FlowFlight</h1>
                <div onClick={()=>connectToPython()} className="megasuperai">Use AI to order the queue</div>
            <div className='addqueue'>
                <input type="text" value={newScheduledTakeOff} onChange={changeNewScheduledTakeOff} placeholder='Time...'></input>
                <input type="number" value={newPriority} onChange={changeNewPriority} placeholder='Priority...'></input>
                <input type="text" value={newFlight} onChange={changeNewFlight} placeholder='Flight...'></input>
                <input type="text" value={newAircraft} onChange={changeNewAircraft} placeholder='Aircraft...'></input>
                <input type="text" value={newAirline} onChange={changeNewAirline} placeholder='Airline...'></input>
                <button onClick={addqueue} className="addButton">Add</button>
            </div>
            <table className="queueTable">
                <thead><tr>
                    <th onClick={()=>sort("ScheduledTakeOff")}>ScheduledTakeOff</th>
                    <th onClick={()=>sort("Priority")}>Priority</th>
                    <th onClick={()=>sort("Flight")}>Flight</th>
                    <th onClick={()=>sort("Aircraft")}>Aircraft</th>
                    <th onClick={()=>sort("Airline")}>Link</th>
                </tr>
                </thead>
                <tbody>
                <tr className="sortRow">
                <td><input type="text" onFocus={()=>{changeFilterMethod("ScheduledTakeOff")}} onChange={changeFilter} value={filterMethod=="ScheduledTakeOff" ? filter : ""}></input></td>
                <td><input type="number" onFocus={()=>{changeFilterMethod("Priority")}} onChange={changeFilter} value={filterMethod=="Priority" ? filter : ""}></input></td>
                <td><input type="text" onFocus={()=>{changeFilterMethod("Flight")}} onChange={changeFilter} value={filterMethod=="Flight" ? filter : ""}></input></td>
                <td><input type="text" onFocus={()=>{changeFilterMethod("Aircraft")}} onChange={changeFilter} value={filterMethod=="Aircraft" ? filter : ""}></input></td>
                <td><input type="text" onFocus={()=>{changeFilterMethod("Airline")}} onChange={changeFilter} value={filterMethod=="Airline" ? filter : "" }></input></td>
                </tr>
                
                {
                filterStatus ?

                  queuesFiltered.map((item,index)=><tr key={index}>
                <td><input type="text" onChange={(e)=>changeQueue(index,'ScheduledTakeOff',e)} value={item.ScheduledTakeOff}></input></td>
                <td><input type="number" onChange={(e)=>changeQueue(index,'Priority',e)} value={item.Priority}></input></td>
                <td><input type="text" onChange={(e)=>changeQueue(index,'Flight',e)} value={item.Flight}></input></td>
                <td><input type="text" onChange={(e)=>changeQueue(index,'Aircraft',e)} value={item.Aircraft}></input></td>
                <td><input type="text" onChange={(e)=>changeQueue(index,'Airline',e)} value={item.Airline}></input></td>
                </tr>
                )

                :
                
                queue.map((item,index)=>
                <tr key={index}>
                <td><input type="text" onChange={(e)=>changeQueue(index,'ScheduledTakeOff',e)} value={item.ScheduledTakeOff}></input></td>
                <td><input type="text" onChange={(e)=>changeQueue(index,'Priority',e)} value={item.Priority}></input></td>
                <td><input type="text" onChange={(e)=>changeQueue(index,'Flight',e)} value={item.Flight}></input></td>
                <td><input type="text" onChange={(e)=>changeQueue(index,'Aircraft',e)} value={item.Aircraft}></input></td>
                <td><input type="text" onChange={(e)=>changeQueue(index,'Airline',e)} value={item.Airline}></input></td>
                <td><button onClick={()=>removequeue(index)} className='removeButton'>Del</button></td>
                <td><button onClick={()=>moveUp(index)} className='moveButton'>⬆</button></td>
                <td><button onClick={()=>moveDown(index)} className='moveButton'>⬇</button></td>
                </tr>
                )
                }
               
                </tbody>
                
            </table>
            <button className="downloadButton" onClick={()=>{downloadJSON(queuesFiltered,getCurrentDateTime())}}>Download JSON</button>
            <button className="downloadButton" onClick={()=>{downloadCSV(queuesFiltered,getCurrentDateTime())}}>Download CSV</button>
            {data ? <p>{data.message}</p> : <p>Loading...</p>}
            </div>
    );
}

Table.propTypes = {
    name: PropTypes.string,
    content: PropTypes.arrayOf(
        PropTypes.shape({
            ScheduledTakeOff: PropTypes.string,
            Priority: PropTypes.number,
            Flight: PropTypes.string,
            Aircraft: PropTypes.string,
            Airline: PropTypes.string
        })
    )
}

export default Table;