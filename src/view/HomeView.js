import React, { useEffect, useState } from 'react';
import ListView from '../component/ListView';
import { Container, Grid, Snackbar, Tab, Tabs } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { getCanteenData, getLibraryData } from '../lib/fetcher';
import Footer from '../component/Footer';
import { useLocalStorageState } from 'ahooks';
import { makeStyles } from '@material-ui/core/styles';
import SubList from '../component/SubList';

const useStyles = makeStyles((theme) => ({
  campusFilter: {
    marginTop: theme.spacing(1),
  },
}));

const filterCampus = (dataList, campusId) => dataList.filter((item) => (campusId === 0) ^ item.name.includes('徐汇'));

const HomeView = () => {
  const classes = useStyles();
  const [campus, setCampus] = useLocalStorageState('campus', 0);

  const [dataCanteen, setDataCanteen] = useState([]);
  const [dataLib, setDataLib] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const [libDataLoading, setLibDataLoading] = useState(true);
  const [canteenDataLoading, setCanteenDataLoading] = useState(true);

  const [canteenSublist, setCanteenSublist] = useLocalStorageState('canteenSubList', [[], []]);

  const fetchData = async () => {
    const openSnackbar = (msg) => {
      setShowSnackbar(true);
      setSnackbarMsg(msg);
    };
    getCanteenData(
      (data) => {
        setDataCanteen(data);
        setCanteenDataLoading(false);
      },
      () => {
        openSnackbar('😥 获取食堂数据失败');
      }
    );
    getLibraryData(
      (data) => {
        setDataLib(data);
        setLibDataLoading(false);
      },
      () => {
        openSnackbar('😫 获取图书馆数据失败');
      }
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => fetchData(), 10000);
    return () => clearInterval(interval);
  }, []);

  const closeSnackbar = () => {
    setShowSnackbar(false);
    setSnackbarMsg('');
  };

  const toggleCanteenSublist = (idx) => {
    const updatedCtSublist = canteenSublist[campus].includes(idx) ? canteenSublist[campus].filter((e) => e !== idx) : canteenSublist[campus].concat(idx);
    const newList = [...canteenSublist];
    newList[campus] = updatedCtSublist;
    setCanteenSublist(newList);
  };

  return (
    <>
      <Container>
        <div className={classes.campusFilter}>
          <Tabs value={campus} indicatorColor="primary" textColor="primary" onChange={(_, value) => setCampus(value)} centered>
            <Tab label="闵行" />
            <Tab label="徐汇" />
          </Tabs>
        </div>
        <Grid container justify="center" direction="column" spacing={2}>
          <Grid item style={{ marginTop: '20px' }}>
            <ListView title="📖" data={filterCampus(dataLib, campus)} loading={libDataLoading} />
            <div style={{ marginTop: '16px' }}>
              <a href="http://booking.lib.sjtu.edu.cn/" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>
                图书馆预约
              </a>
            </div>
          </Grid>
          <Grid item>
            <ListView
              title="🍴"
              data={filterCampus(dataCanteen, campus)}
              loading={canteenDataLoading}
              onClick={(idx) => toggleCanteenSublist(idx)}
              renderSubitem={(ele, idx) => <SubList id={idx} data={ele} />}
              subList={canteenSublist[campus]}
            />
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={showSnackbar}
          autoHideDuration={2000}
          onClose={() => closeSnackbar()}
        >
          <MuiAlert severity="error">{snackbarMsg}</MuiAlert>
        </Snackbar>
        <Footer />
      </Container>
    </>
  );
};

export default HomeView;
