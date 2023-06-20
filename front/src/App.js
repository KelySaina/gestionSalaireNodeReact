import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Dialog, DialogContent } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';

function App() {
  const [message, setMessage] = useState([]);
  const [filteredMessage, setFilteredMessage] = useState([]);

  const listE = async () => {
    const response = await axios.get('http://localhost:5000/listEmployees');
    const data = response.data
    getSalaires()
    setMessage(data)
    setFilteredMessage(data)
  }


  const deleteE = async (id) => {

    const response = await axios.delete(`http://localhost:5000/delEmployee/${id}`);
    toast.info(response.data);
    listE()

  }

  const insertE = async () => {
    const response = await axios.post("http://localhost:5000/inEmployee", employeeInfo);
    toast.info(response.data);
    listE()
    setAdd(false)
  }

  const modifyE = async () => {
    const newInfo = {
      newName: employeeNewInfo.newName,
      newSalaire: employeeNewInfo.newSalaire,
      id: id
    }
    const response = await axios.post("http://localhost:5000/modEmployee", newInfo);
    toast.info(response.data);
    listE()
    setMod(false)

  }

  const [employeeNewInfo, setEmployeeNewInfo] = useState({
    newName: '',
    newSalaire: ''
  })
  const [id, setId] = useState('')

  const getEmData = async (id) => {
    setId(id)
    const response = await axios.get(`http://localhost:5000/getEmployee/${id}`);
    const nameData = response.data[0].nom_employee;
    const salaireData = response.data[0].salaire_employee;
    setEmployeeNewInfo(() => ({
      'newName': nameData,
      'newSalaire': salaireData
    }))
  }

  useEffect(() => {
    listE();
  }, [])

  const [employeeInfo, setEmployeeInfo] = useState({
    name: '',
    salaire: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEmployeeInfo((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleChange2 = (event) => {
    const { name, value } = event.target;
    setEmployeeNewInfo((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const [add, setAdd] = useState(false)
  const [mod, setMod] = useState(false)

  const [salaires, setSalaires] = useState({
    min: '',
    max: ''
  })

  const getSalaires = async () => {
    const response = await axios.get('http://localhost:5000/getSalaire');
    setSalaires({
      'min': response.data[0].min,
      'max': response.data[0].max
    })
  }

  const handleSearch = (searchText) => {
    const filteredMessage = message.filter((m) =>
      m.nom_employee.includes(searchText) || m.salaire_employee.toString().includes(searchText) || m.id_employee.toString().includes(searchText)
    );
    setFilteredMessage(filteredMessage);

  };

  const [searchText, setSearchText] = useState('');
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    handleSearch(value);
  }

  return (
    <>

      <Dialog size="md" open={add} onClose={() => setAdd(false)}>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', justifyContent: 'space-around' }}>
          <TextField style={{ marginBottom: '15px' }} size='small' label="Name" type='text' name="name" value={employeeInfo.name} onChange={handleChange} />
          <TextField style={{ marginBottom: '15px' }} size='small' label="Salaire" type='text' name="salaire" value={employeeInfo.salaire} onChange={handleChange} />
          <div>
            <Button style={{ margin: '10px' }} color='success' variant="contained" onClick={insertE}>
              Submit
            </Button>
            <Button style={{ margin: '10px' }} variant="outlined" color="error" onClick={() => setAdd(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog size="md" open={mod} onClose={() => setMod(false)}>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', justifyContent: 'space-around' }}>
          <TextField style={{ marginBottom: '15px' }} size='small' label="New name" type='text' name='newName' value={employeeNewInfo.newName} onChange={handleChange2} />
          <TextField style={{ marginBottom: '15px' }} size='small' label="New salary" type='text' name='newSalaire' value={employeeNewInfo.newSalaire} onChange={handleChange2} />
          <div>
            <Button style={{ margin: '10px' }} color='success' variant="contained" onClick={modifyE}>
              Submit
            </Button>
            <Button style={{ margin: '10px' }} variant="outlined" color="error" onClick={() => setMod(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <h1>
        Salary Management
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button style={{ margin: '15px' }} startIcon={<PersonAddIcon />} size='large' variant='contained' onClick={() => { setAdd(true) }}>
          <strong>Add</strong>
        </Button>
        <TextField style={{ marginRight: '15px' }}
          variant='outlined'
          size="small"
          label='Search'
          InputProps={{
            endAdornment: <SearchIcon fontSize='small' />,
          }}
          value={searchText}
          onInput={handleInputChange}
        />
      </div>

      <div>
        <table class="table table-hover table-bordered" >
          <thead style={{ textAlign: 'center' }}>
            <tr>
              <th>
                NUMERO
              </th>
              <th>
                NAME
              </th>
              <th>
                SALAIRE
              </th>
              <th>
                OBSERVATION
              </th>
              <th>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {
              filteredMessage.map((m) => (
                <tr key={m.id_employee}>
                  <td>{m.id_employee}</td>
                  <td>{m.nom_employee}</td>
                  <td>{m.salaire_employee} Ar</td>
                  <td>{m.salaire_employee < 1000 ? "Mediocre" : m.salaire_employee > 5000 ? "Grand" : "Moyen"}</td>
                  <td>
                    <Button startIcon={<BorderColorIcon />} style={{ width: '100px', margin: '0 10px' }} variant="contained" onClick={() => { getEmData(m.id_employee); setMod(true) }}>
                      <strong>Edit</strong>
                    </Button>

                    <Button startIcon={<DeleteForeverIcon />} style={{ width: '100px', margin: '0 10px' }} variant="outlined" color="error" onClick={() => deleteE(m.id_employee)}>
                      <strong>Delete</strong>
                    </Button>

                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div>
        <p><b>Salaire minimal: </b>{salaires.min} Ar</p>
        <p><b>Salaire maximal: </b>{salaires.max} Ar</p>
      </div>
      <ToastContainer />

    </>
  );
}

export default App;
