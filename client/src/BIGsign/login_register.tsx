import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AlertColor } from "@mui/material/Alert";

type Props = {
  onAuthSuccess: (username: string) => void;
};

/**
 * ログインorユーザーデータ登録ページ
 * Material UIを使用したモーダルダイアログ
 */
function Login_register({ onAuthSuccess }: Props) {
  // ユーザーデータ型
  type userData = {
    username: string;
    password: string;
  };

  // フォーム管理
  // 例：register = useForm.register のようなもの
  const { register, handleSubmit, formState: { errors }, reset } = useForm<userData>();

  // モード管理
  const [mode, setMode] = useState<"login" | "register">("login");

  // ローディング状態
  const [loading, setLoading] = useState(false);

  // アラート状態
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    severity: AlertColor;
  }>({ show: false, message: "", severity: "info" });

  // モード切り替え
  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    reset();
    setAlert({ show: false, message: "", severity: "info" });
  };

  // フォーム送信時の処理選択
  const selectLoginMode = () => {
    return mode === "login" ? onSubmitLogin : onSubmitRegister;
  }

  // ログイン処理
  const onSubmitLogin = async (data: userData) => {
    try {
      setLoading(true);
      // localhostの3000番にユーザーデータを送信
      const res = await axios.post("http://localhost:3000/login", data, {
        withCredentials: true,
      }); // JWTを取得するために必要

      console.log("サーバーからの返答:", res.data);
      console.log("username:", res.data.username);
      console.log("フォームのusername:", data.username);

      setAlert({
        show: true,
        message: "ログイン成功しました！",
        severity: "success",
      });

      // 少し遅延させてから次のページに遷移
      setTimeout(() => {
        onAuthSuccess(res.data.username);
      }, 1500);
    } catch (error: any) {
      setAlert({
        show: true,
        message: `ログイン失敗: ${error.response?.data?.message || "エラーが発生しました"}`,
        severity: "error",
      });
      console.error("ログインエラー:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  // 登録処理
  const onSubmitRegister = async (data: userData) => {
    try {
      setLoading(true);
      // localhostの3000番にユーザーデータを送信
      const res = await axios.post("http://localhost:3000/register", data, {
        withCredentials: true,
      }); // JWTを取得するために必要

      console.log("登録成功:", res.data);

      setAlert({
        show: true,
        message: "登録成功しました！",
        severity: "success",
      });

      // サーバーレスポンスから username を取得
      const username = res.data.username || data.username;

      // 少し遅延させてから次のページに遷移
      setTimeout(() => {
        onAuthSuccess(username);
      }, 1500);
    } catch (error: any) {
      setAlert({
        show: true,
        message: `登録失敗: ${error.response?.data?.message || "エラーが発生しました"}`,
        severity: "error",
      });
      console.error("登録エラー:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        {mode === "login" ? "ログイン" : "アカウント登録"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* アラート表示 */}
        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        {/* フォーム */}
        <Box
          component="form"
          onSubmit={handleSubmit(selectLoginMode())}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* ユーザーネーム入力 */}
          <TextField
            {...register("username", {
              required: "ユーザーネームは必須です",
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "半角英数字のみ入力できます",
              },
            })}
            label="ユーザーネーム"
            type="text"
            variant="outlined"
            fullWidth
            disabled={loading}
            error={!!errors.username}
            helperText={errors.username?.message}
            inputProps={{ maxLength: 20 }}
          />

          {/* パスワード入力 */}
          <TextField
            {...register("password", {
              required: "パスワードは必須です",
              minLength: {
                value: 4,
                message: "パスワードは4文字以上である必要があります",
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "半角英数字のみ入力できます",
              },
            })}
            label="パスワード"
            type="password"
            variant="outlined"
            fullWidth
            disabled={loading}
            error={!!errors.password}
            helperText={errors.password?.message}
            inputProps={{ maxLength: 30 }}
          />

          {/* ボタングループ */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* 送信ボタン */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading
                ? "処理中..."
                : mode === "login"
                ? "ログイン"
                : "登録する"}
            </Button>

            {/* モード切り替えボタン */}
            <Button
              variant="outlined"
              fullWidth
              onClick={switchMode}
              disabled={loading}
            >
              {mode === "login" ? "登録へ" : "ログインへ"}
            </Button>
          </Stack>

          {/* 説明文 */}
          <Typography variant="caption" sx={{ textAlign: "center", color: "text.secondary" }}>
            {mode === "login"
              ? "アカウントがない場合は「登録へ」をクリック"
              : "既にアカウントがある場合は「ログインへ」をクリック"}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default Login_register;