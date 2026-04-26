import { useState, useEffect } from 'react'
import { AppRoutes } from './routes/AppRoutes'
import { Login_register as Login } from './BIGsign'
import { Setting } from './BIGsign/Setting'
import { IconButton, Box } from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'
import './App.css'

function App() {
  // ログイン状態の管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [YourID, setYourID] = useState("test");
  const [openSettings, setOpenSettings] = useState(false);

  // サーバーメッセージの管理
  // const [message, setMessage] = useState('');

  // ログイン完了時の処理
  const setLoginOK = (LoginName: string) => {
    setYourID(LoginName);
    setIsAuthenticated(true);
  };

  // 初期データ取得
  // useEffect(() => {
  //   fetch("http://localhost:3000")
  //     .then(res => res.text())
  //     .then(data => setMessage(data))
  //     .catch(err => setMessage('Error: ' + err.message));
  // }, []);

  // 自動ログイン
  useEffect(() => {
    fetch("http://localhost:3000/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setLoginOK(data.username);
      })
      .catch((e) => {
        console.log("meのエラー:", e);
      });
  }, []);

  return (
    <>
      {!isAuthenticated && <Login onAuthSuccess={setLoginOK} />}
      <div className='ml-[5%] flex flex-col self-start relative'>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <p className='text-2xl m-0'>{YourID}</p>
          <IconButton
            onClick={() => setOpenSettings(true)}
            sx={{ mr: 2, color: 'inherit' }}
            title="設定"
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </div>
      <Setting open={openSettings} onClose={() => setOpenSettings(false)} />
      <AppRoutes />
      {/* <p>{message}</p>  ここをonにすると3000からのメッセージが見えます　off推奨*/}
    </>
  );
}

export default App;