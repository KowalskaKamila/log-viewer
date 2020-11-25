/**************************
 * Imports
 **************************/
// Libraries
import React, { useEffect, useState} from 'react';
import { Layout} from 'antd';
import axios from 'axios'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { FileOutlined } from '@ant-design/icons';

// Interal imports
import LogsTable from './LogsTable';
import FilesTable from './FilesTable';
import { ILogFile } from '../types';


const { Header, Content} = Layout;

/**************************
 * Component
 **************************/
const Dashboard = () => {

  /**************************
   * Setting state variables
   **************************/

  const [logs, setLogs] = useState<ILogFile[]>([]);
  const [logsLoading, setlogsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  /**************************
   * Functions to pass to children
   **************************/
  const setNewSearchQuery = (NewSearchQuery: string) => {
    setSearchQuery(NewSearchQuery);
  };

  /**************************
   * Local functions
  **************************/

    const getAllLogs =  async() => {
        setlogsLoading(true)
        await axios.get('http://localhost:8083/logs')
        .then(response => {
          setlogsLoading(false)
          setLogs(response.data)
      })
      .catch(err => {
        setlogsLoading(false)
          if (err || !err.response) {
            console.log("error")
          } else {
            console.log(err)
          }  
      })
    };

    useEffect(() => {
      getAllLogs();
    }, [] )

  /**************************
   * Render
   **************************/
  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%'}}>
        <h2 style={{ color:'white'}} >
          <FileOutlined />
          Logs viewer
        </h2>
      </Header>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Content
          style={{
            padding: '25px 50px',
            marginTop: '100px',
            background: '#f0f2f5',
            flexGrow: 1,
          }}
        >  
          <div style={{ background: 'white', padding: '40px 60px' }}>
            <Router> 
              <Switch>
                <Route exact path={'/'} render={() => 
                  <FilesTable 
                    logs={logs}
                    logsLoading={logsLoading}
                    searchQuery={searchQuery}
                    setSearchQuery={setNewSearchQuery}
                  />
                }/>
                <Route exact path={'/:fileName'} component={LogsTable} />
              </Switch>
            </Router>
          </div>
        </Content>
      </div>
    </Layout>
  );
};

export default Dashboard;
