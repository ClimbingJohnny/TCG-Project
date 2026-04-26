import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Switch,
  Slider,
  FormControlLabel,
  Paper,
  Button,
} from '@mui/material';
import {
  Person as PersonIcon,
  Gamepad as GamepadIcon,
  VolumeUp as VolumeIcon,
  Brightness4 as BrightnessIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface SettingProps {
  open: boolean;
  onClose: () => void;
}

type SettingTab = 'profile' | 'game' | 'sound' | 'graphics' | 'privacy' | 'about';

export const Setting: React.FC<SettingProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingTab>('profile');
  
  // プロフィール設定
  const [profile, setProfile] = useState({
    displayName: 'Player Name',
    email: 'player@example.com',
    bio: 'Hello, I am a duelist!',
  });

  // ゲーム設定
  const [gameSettings, setGameSettings] = useState({
    autoSave: true,
    showFps: false,
    animationSpeed: 50,
    difficulty: 'normal' as 'easy' | 'normal' | 'hard',
  });

  // サウンド設定
  const [soundSettings, setSoundSettings] = useState({
    masterVolume: 70,
    bgmVolume: 60,
    seVolume: 80,
    voiceVolume: 75,
    muteInBackground: true,
  });

  // グラフィックス設定
  const [graphicsSettings, setGraphicsSettings] = useState({
    resolution: '1920x1080' as '1280x720' | '1920x1080' | '2560x1440',
    quality: 'high' as 'low' | 'medium' | 'high' | 'ultra',
    fps: 60,
    vsync: true,
    enableParticles: true,
  });

  // プライバシー設定
  const [privacySettings, setPrivacySettings] = useState({
    isPublic: false,
    allowFriendRequests: true,
    showOnlineStatus: true,
    allowMessages: true,
  });

  const menuItems = [
    { id: 'profile' as SettingTab, label: 'プロフィール', icon: <PersonIcon /> },
    { id: 'game' as SettingTab, label: 'ゲーム設定', icon: <GamepadIcon /> },
    { id: 'sound' as SettingTab, label: 'サウンド設定', icon: <VolumeIcon /> },
    { id: 'graphics' as SettingTab, label: 'グラフィックス', icon: <BrightnessIcon /> },
    { id: 'privacy' as SettingTab, label: 'プライバシー', icon: <SecurityIcon /> },
    { id: 'about' as SettingTab, label: '情報', icon: <InfoIcon /> },
  ];

  // プロフィール設定のレンダリング
  const renderProfileSettings = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="表示名"
        value={profile.displayName}
        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
        variant="outlined"
      />
      <TextField
        fullWidth
        label="メールアドレス"
        type="email"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        variant="outlined"
      />
      <TextField
        fullWidth
        label="自己紹介"
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        variant="outlined"
        multiline
        rows={3}
      />
      <Button variant="contained" sx={{ mt: 2 }}>
        変更を保存
      </Button>
    </Box>
  );

  // ゲーム設定のレンダリング
  const renderGameSettings = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={gameSettings.autoSave}
            onChange={(e) =>
              setGameSettings({ ...gameSettings, autoSave: e.target.checked })
            }
          />
        }
        label="自動保存"
      />
      <FormControlLabel
        control={
          <Switch
            checked={gameSettings.showFps}
            onChange={(e) =>
              setGameSettings({ ...gameSettings, showFps: e.target.checked })
            }
          />
        }
        label="FPS表示"
      />
      <Box>
        <label>アニメーション速度: {gameSettings.animationSpeed}%</label>
        <Slider
          value={gameSettings.animationSpeed}
          onChange={(_, value) =>
            setGameSettings({ ...gameSettings, animationSpeed: value as number })
          }
          min={0}
          max={100}
          sx={{ mt: 1 }}
        />
      </Box>
      <Box>
        <label>難易度</label>
        <select
          value={gameSettings.difficulty}
          onChange={(e) =>
            setGameSettings({
              ...gameSettings,
              difficulty: e.target.value as 'easy' | 'normal' | 'hard',
            })
          }
          style={{ width: '100%', padding: '8px', marginTop: '8px', borderRadius: '4px' }}
        >
          <option value="easy">イージー</option>
          <option value="normal">ノーマル</option>
          <option value="hard">ハード</option>
        </select>
      </Box>
      <Button variant="contained" sx={{ mt: 2 }}>
        変更を保存
      </Button>
    </Box>
  );

  // サウンド設定のレンダリング
  const renderSoundSettings = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <label>マスターボリューム: {soundSettings.masterVolume}%</label>
        <Slider
          value={soundSettings.masterVolume}
          onChange={(_, value) =>
            setSoundSettings({ ...soundSettings, masterVolume: value as number })
          }
          min={0}
          max={100}
          sx={{ mt: 1 }}
        />
      </Box>
      <Box>
        <label>BGMボリューム: {soundSettings.bgmVolume}%</label>
        <Slider
          value={soundSettings.bgmVolume}
          onChange={(_, value) =>
            setSoundSettings({ ...soundSettings, bgmVolume: value as number })
          }
          min={0}
          max={100}
          sx={{ mt: 1 }}
        />
      </Box>
      <Box>
        <label>SEボリューム: {soundSettings.seVolume}%</label>
        <Slider
          value={soundSettings.seVolume}
          onChange={(_, value) =>
            setSoundSettings({ ...soundSettings, seVolume: value as number })
          }
          min={0}
          max={100}
          sx={{ mt: 1 }}
        />
      </Box>
      <Box>
        <label>ボイスボリューム: {soundSettings.voiceVolume}%</label>
        <Slider
          value={soundSettings.voiceVolume}
          onChange={(_, value) =>
            setSoundSettings({ ...soundSettings, voiceVolume: value as number })
          }
          min={0}
          max={100}
          sx={{ mt: 1 }}
        />
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={soundSettings.muteInBackground}
            onChange={(e) =>
              setSoundSettings({
                ...soundSettings,
                muteInBackground: e.target.checked,
              })
            }
          />
        }
        label="バックグラウンド時はミュート"
      />
      <Button variant="contained" sx={{ mt: 2 }}>
        変更を保存
      </Button>
    </Box>
  );

  // グラフィックス設定のレンダリング
  const renderGraphicsSettings = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <label>解像度</label>
        <select
          value={graphicsSettings.resolution}
          onChange={(e) =>
            setGraphicsSettings({
              ...graphicsSettings,
              resolution: e.target.value as '1280x720' | '1920x1080' | '2560x1440',
            })
          }
          style={{ width: '100%', padding: '8px', marginTop: '8px', borderRadius: '4px' }}
        >
          <option value="1280x720">1280x720 (HD)</option>
          <option value="1920x1080">1920x1080 (Full HD)</option>
          <option value="2560x1440">2560x1440 (2K)</option>
        </select>
      </Box>
      <Box>
        <label>グラフィック品質</label>
        <select
          value={graphicsSettings.quality}
          onChange={(e) =>
            setGraphicsSettings({
              ...graphicsSettings,
              quality: e.target.value as 'low' | 'medium' | 'high' | 'ultra',
            })
          }
          style={{ width: '100%', padding: '8px', marginTop: '8px', borderRadius: '4px' }}
        >
          <option value="low">低 (Low)</option>
          <option value="medium">中 (Medium)</option>
          <option value="high">高 (High)</option>
          <option value="ultra">最高 (Ultra)</option>
        </select>
      </Box>
      <Box>
        <label>フレームレート上限: {graphicsSettings.fps} FPS</label>
        <Slider
          value={graphicsSettings.fps}
          onChange={(_, value) =>
            setGraphicsSettings({ ...graphicsSettings, fps: value as number })
          }
          min={30}
          max={240}
          step={30}
          sx={{ mt: 1 }}
        />
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={graphicsSettings.vsync}
            onChange={(e) =>
              setGraphicsSettings({ ...graphicsSettings, vsync: e.target.checked })
            }
          />
        }
        label="垂直同期（VSync）"
      />
      <FormControlLabel
        control={
          <Switch
            checked={graphicsSettings.enableParticles}
            onChange={(e) =>
              setGraphicsSettings({
                ...graphicsSettings,
                enableParticles: e.target.checked,
              })
            }
          />
        }
        label="パーティクル効果を有効化"
      />
      <Button variant="contained" sx={{ mt: 2 }}>
        変更を保存
      </Button>
    </Box>
  );

  // プライバシー設定のレンダリング
  const renderPrivacySettings = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={privacySettings.isPublic}
            onChange={(e) =>
              setPrivacySettings({ ...privacySettings, isPublic: e.target.checked })
            }
          />
        }
        label="プロフィールを公開"
      />
      <FormControlLabel
        control={
          <Switch
            checked={privacySettings.allowFriendRequests}
            onChange={(e) =>
              setPrivacySettings({
                ...privacySettings,
                allowFriendRequests: e.target.checked,
              })
            }
          />
        }
        label="フレンドリクエストを許可"
      />
      <FormControlLabel
        control={
          <Switch
            checked={privacySettings.showOnlineStatus}
            onChange={(e) =>
              setPrivacySettings({
                ...privacySettings,
                showOnlineStatus: e.target.checked,
              })
            }
          />
        }
        label="オンラインステータスを表示"
      />
      <FormControlLabel
        control={
          <Switch
            checked={privacySettings.allowMessages}
            onChange={(e) =>
              setPrivacySettings({
                ...privacySettings,
                allowMessages: e.target.checked,
              })
            }
          />
        }
        label="メッセージ受け取りを許可"
      />
      <Button variant="contained" sx={{ mt: 2 }}>
        変更を保存
      </Button>
    </Box>
  );

  // 情報のレンダリング
  const renderAbout = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Box sx={{ mb: 1 }}>
          <strong>アプリケーション名:</strong> Digital Card Game
        </Box>
        <Box sx={{ mb: 1 }}>
          <strong>バージョン:</strong> 0.7.0
        </Box>
        <Box sx={{ mb: 1 }}>
          <strong>開発者:</strong> Game Studio
        </Box>
        <Box>
          <strong>ライセンス:</strong> MIT License
        </Box>
      </Paper>
      <Button variant="outlined" fullWidth>
        プライバシーポリシー
      </Button>
      <Button variant="outlined" fullWidth>
        利用規約
      </Button>
      <Button variant="outlined" fullWidth>
        チェックアップデート
      </Button>
    </Box>
  );

  // アクティブなタブに基づいてコンテンツをレンダリング
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'game':
        return renderGameSettings();
      case 'sound':
        return renderSoundSettings();
      case 'graphics':
        return renderGraphicsSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'about':
        return renderAbout();
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: 3,
          },
        },
      }}
    >
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        設定
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: '600px' }}>
          {/* 左側サイドバー */}
          <Box
            sx={{
              width: { xs: '100%', sm: '33.333%' },
              borderRight: '1px solid #e0e0e0',
              bgcolor: '#fafafa',
              overflow: 'auto',
            }}
          >
            <List sx={{ p: 0 }}>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    onClick={() => setActiveTab(item.id)}
                    sx={{
                      bgcolor:
                        activeTab === item.id
                          ? 'rgba(25, 103, 210, 0.1)'
                          : 'transparent',
                      borderLeft:
                        activeTab === item.id
                          ? '4px solid #1967d2'
                          : '4px solid transparent',
                      '&:hover': {
                        bgcolor:
                          activeTab === item.id
                            ? 'rgba(25, 103, 210, 0.15)'
                            : '#f0f0f0',
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                  {index < menuItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          {/* 右側コンテンツ */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              width: '66.667%',
              p: 3,
              overflow: 'auto',
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
