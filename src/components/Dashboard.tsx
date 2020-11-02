/**************************
 * Imports
 **************************/
// Libraries
import React, { useEffect, useState} from 'react';
import { Layout } from 'antd';
import axios from 'axios'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'

// Interal imports
import LogsTable from './LogsTable';
import FilesTable from './FilesTable';
import { ILogs } from '../types';


const { Header, Content, Footer } = Layout;

/**************************
 * Component
 **************************/
const Dashboard = () => {

  /**************************
   * Setting state variables
   **************************/

  const [logs, setLogs] = useState<ILogs[]>([]);
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
        {/* <Header style={{ position: 'fixed', zIndex: 1, width: '100%', color: 'white' }}>Logs overview</Header> */}
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Content
            style={{
              padding: '25px 50px',
              marginTop: 64,
              background: '#f0f2f5',
              flexGrow: 1,
            }}
          >
            <div style={{ background: 'white', padding: '40px 60px' }}>
              <Router> 
                <Switch>
                  <Route exact path={"/"} render={() => 
                    <LogsTable 
                      logs={logs}
                      logsLoading={logsLoading}
                      searchQuery={searchQuery}
                      setSearchQuery={setNewSearchQuery}
                    />
                  }/>
                  <Route exact path={"/:fileName"} component={FilesTable} />
                </Switch>
              </Router>
            </div>
          </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Made by Kamila Kowalska</Footer> */}
      </div>
    </Layout>
  );
};

export default Dashboard;
