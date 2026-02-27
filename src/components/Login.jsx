import * as React from 'react';
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Alert from '@mui/joy/Alert';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import './../styles/Login.css';

// ─────────────────────────────────────────────────────────────
// 1. Inject keyframe animations (runs once at module load)
// ─────────────────────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.head.querySelector('#login-panel-styles')) {
  const s = document.createElement('style');
  s.id = 'login-panel-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

    @keyframes blobFloat1 {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(20px,-30px) scale(1.05); }
      66%      { transform: translate(-15px,20px) scale(0.95); }
    }
    @keyframes blobFloat2 {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(-25px,15px) scale(1.08); }
      66%      { transform: translate(20px,-20px) scale(0.92); }
    }
    @keyframes typingDot {
      0%,60%,100% { opacity:0.3; transform:translateY(0); }
      30%          { opacity:1;   transform:translateY(-3px); }
    }
  `;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────
// 2. Right-panel inline styles
// ─────────────────────────────────────────────────────────────
const ps = {
  container: {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.45)',
  // backdropFilter: 'blur(8px)'
},
  content: {
    position: 'relative', zIndex: 10,
    width: '85%', maxWidth: 420,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
  },
  tabBar: {
    display: 'flex',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: 4, gap: 4,
    backdropFilter: 'blur(12px)', width: '60%', justifyContent: 'center',
  },
  tabActive: {
    flex: 1, textAlign: 'center', padding: '7px 20px', borderRadius: 7,
    background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 13,
    fontFamily: "'DM Sans',sans-serif", fontWeight: 500, cursor: 'pointer',
    letterSpacing: '0.01em',
  },
  tabInactive: {
    flex: 1, textAlign: 'center', padding: '7px 20px', borderRadius: 7,
    color: 'rgba(255,255,255,0.4)', fontSize: 13,
    fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', letterSpacing: '0.01em',
  },
  chatWindow: {
    width: '100%',
    background: 'rgba(18,18,26,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, backdropFilter: 'blur(20px)', overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
  },
  messageList: {
    minHeight: 320, maxHeight: 380, overflowY: 'auto',
    padding: '20px 16px', display: 'flex', flexDirection: 'column',
    gap: 14, scrollbarWidth: 'none',
  },
  userBubbleWrap: { display: 'flex', justifyContent: 'flex-end' },
  userBubble: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#f0f0f5', padding: '10px 14px',
    borderRadius: '14px 14px 4px 14px',
    fontSize: 13.5, lineHeight: 1.5, maxWidth: '80%',
    fontFamily: "'DM Sans',sans-serif", backdropFilter: 'blur(10px)',
  },
  aiBubbleWrap: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  aiAvatar: {
    width: 26, height: 26, borderRadius: '50%',
    background: 'linear-gradient(135deg,#c84b2f,#8f3fcf)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 10, flexShrink: 0, marginTop: 2,
    boxShadow: '0 2px 10px rgba(200,75,47,0.4)',
  },
  aiBubble: {
    color: '#d0d0e0', fontSize: 13.5, lineHeight: 1.6,
    maxWidth: 'calc(100% - 40px)',
    fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.01em',
  },
  typingBubble: {
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
    borderRadius: '14px 14px 14px 4px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  dot: {
    display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
    background: 'rgba(255,255,255,0.4)',
    animation: 'typingDot 1.2s ease-in-out infinite',
  },
  searchRow: { display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' },
  searchText: { color: 'rgba(168,168,179,0.8)', fontSize: 12, fontFamily: "'DM Sans',sans-serif" },
  searchArrow: { color: 'rgba(168,168,179,0.5)', fontSize: 14 },
  inputBar: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(10,10,16,0.5)',
  },
  inputFake: {
    flex: 1, padding: '9px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  inputPlaceholder: { color: 'rgba(255,255,255,0.2)', fontSize: 13, fontFamily: "'DM Sans',sans-serif" },
  sendBtn: {
    width: 34, height: 34, borderRadius: 8,
    background: 'linear-gradient(135deg,#c84b2f,#8f3fcf)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', cursor: 'pointer', flexShrink: 0,
    boxShadow: '0 2px 12px rgba(200,75,47,0.35)',
  },
  bottomLabel: { display: 'flex', alignItems: 'center', gap: 8 },
  logoMark: { color: '#c84b2f', fontSize: 14, filter: 'drop-shadow(0 0 6px rgba(200,75,47,0.6))' },
  labelText: {
    color: 'rgba(255,255,255,0.25)', fontSize: 12,
    fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase',
  },
};

// ─────────────────────────────────────────────────────────────
// 3. Right-panel sub-components
// ─────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const fade = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: 'all 0.4s ease',
  };

  if (msg.type === 'search') {
    return (
      <div style={{ ...ps.searchRow, ...fade }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#a8a8b3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span style={ps.searchText}>{msg.text}</span>
        <span style={ps.searchArrow}>›</span>
      </div>
    );
  }

  if (msg.type === 'user') {
    return (
      <div style={{ ...ps.userBubbleWrap, ...fade }}>
        <div style={ps.userBubble}>{msg.text}</div>
      </div>
    );
  }

  return (
    <div style={{ ...ps.aiBubbleWrap, ...fade }}>
      <img
            src="/my-avatar.png"
            alt="Vamshi Ragipani"
            className="profile-avatar"
          />
      <div style={ps.aiBubble}>{msg.text}</div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={ps.aiBubbleWrap}>
      <img
            src="/my-avatar.png"
            alt="Vamshi Ragipani"
            className="profile-avatar"
          />
      <div style={ps.typingBubble}>
        <span style={{ ...ps.dot, animationDelay: '0ms' }} />
        <span style={{ ...ps.dot, animationDelay: '160ms' }} />
        <span style={{ ...ps.dot, animationDelay: '320ms' }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. LoginRightPanel
// ─────────────────────────────────────────────────────────────
const CONVERSATION = [
  { id: 1, type: 'user',   text: 'How should I structure this project proposal?' },
  { id: 2, type: 'ai',     text: "I'd go with: Problem → Solution → Timeline → Ask. Keep it tight — one page max. The trick is making the problem feel urgent before you pitch the fix." },
  { id: 3, type: 'user',   text: 'Can you find some examples of successful proposals in our industry?' },
  { id: 4, type: 'search', text: 'Searched 3 sites' },
  { id: 5, type: 'ai',     text: "I found a few strong examples. The best ones all lead with a sharp metric — like \"We're losing 12 hours/week to manual reporting.\" Then they tie it to a dollar figure before pitching the fix." },
];
const MSG_DELAYS    = [600, 1800, 3400, 4600, 5000, 6800];
const CYCLE_MS      = 13000;

function LoginRightPanel() {
  const [visibleMessages, setVisibleMessages] = React.useState([]);
  const [typingIndex,     setTypingIndex]     = React.useState(null);
  const [cycle,           setCycle]           = React.useState(0);

  // Auto-reset loop
  React.useEffect(() => {
    const id = setInterval(() => {
      setVisibleMessages([]);
      setTypingIndex(null);
      setCycle(c => c + 1);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  // Animate conversation on each cycle
  React.useEffect(() => {
    const timers = [];
    CONVERSATION.forEach((msg, i) => {
      if (msg.type === 'ai') {
        timers.push(setTimeout(() => setTypingIndex(msg.id), MSG_DELAYS[i] - 800));
      }
      timers.push(
        setTimeout(() => {
          setTypingIndex(null);
          setVisibleMessages(prev =>
            prev.find(m => m.id === msg.id) ? prev : [...prev, msg]
          );
        }, MSG_DELAYS[i])
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  return (
    <div style={ps.container}>
      <div style={ps.blob1} /><div style={ps.blob2} /><div style={ps.blob3} />
      <div style={ps.grid} />

      <div style={ps.content}>
        {/* Tabs */}
        <div style={ps.tabBar}>
          <div style={ps.tabActive}>Chat</div>
        </div>

        {/* Chat window */}
        <div style={ps.chatWindow}>
          <div style={ps.messageList}>
            {visibleMessages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
            {typingIndex !== null && <TypingIndicator />}
          </div>

          {/* Fake input */}
          <div style={ps.inputBar}>
            <div style={ps.inputFake}>
              <span style={ps.inputPlaceholder}>Ask anything...</span>
            </div>
            <div style={ps.sendBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer label */}
        <div style={ps.bottomLabel}>
          <div style={ps.logoMark}>✦</div>
          <span style={ps.labelText}>Kofax AI Assistant</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Color scheme toggle
// ─────────────────────────────────────────────────────────────
function ColorSchemeToggle({ onClick, ...other }) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <IconButton
      size="sm" variant="outlined" disabled={!mounted}
      onClick={e => { setMode(mode === 'light' ? 'dark' : 'light'); onClick?.(e); }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. Theme
// ─────────────────────────────────────────────────────────────
const theme = extendTheme({ defaultColorScheme: 'dark' });

// ─────────────────────────────────────────────────────────────
// 7. Main Login export
// ─────────────────────────────────────────────────────────────
export default function Login({ onLogin }) {
  const [error, setError] = React.useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const username = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    if (username === 'admin' && password === 'admin') {
      setError('');
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <CssVarsProvider theme={theme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles styles={{ ':root': { '--Form-maxWidth': '800px' } }} />

      <Box sx={{ display: 'flex', minHeight: '100vh' }}>

        {/* ── Left: form ── */}
        <Box
          sx={t => ({
            width: { xs: '100%', md: '50vw' },
            position: 'relative', zIndex: 1,
            display: 'flex', justifyContent: 'flex-end',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255 255 255 / 0.2)',
            [t.getColorSchemeSelector('dark')]: {
              backgroundColor: 'rgba(19 19 24 / 0.4)',
            },
          })}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', px: 3 }}>

            {/* Header */}
            <Box sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img src="/my-avatar.png" alt="Profile" className="profile-avatar" />
                <Typography level="title-lg">Kofax Dashboard</Typography>
              </Box>
              <ColorSchemeToggle />
            </Box>

            {/* Card */}
            <Box sx={{ margin: 'auto', width: 420, maxWidth: '100%', borderRadius: 12, p: 4, boxShadow: 'lg', backgroundColor: 'background.surface' }}>
              <Stack spacing={3}>
                <Typography level="h2">Welcome Back</Typography>
                <Typography level="body-sm">Login to access your dashboard</Typography>

                {error && <Alert color="danger">{error}</Alert>}

                <form onSubmit={handleSubmit}>
                  <FormControl required>
                    <FormLabel>Username</FormLabel>
                    <Input name="email" placeholder="Enter username" />
                  </FormControl>

                  <FormControl required sx={{ mt: 2 }}>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="password" placeholder="Enter password" />
                  </FormControl>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Checkbox label="Remember me" name="remember" />
                  </Box>

                  <Button type="submit" fullWidth size="lg" sx={{ mt: 3 }}>
                    Login
                  </Button>
                </form>
              </Stack>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 3 }}>
              <Typography level="body-xs" textAlign="center">
                © Kofax Dashboard {new Date().getFullYear()}
              </Typography>
            </Box>

          </Box>
        </Box>

        {/* ── Right: animated panel ── */}
        <Box
  sx={theme => ({
    display: { xs: 'none', md: 'block' },
    width: '50vw',
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: "url('/assets/login/login-light-theme.avif')",
    
    [theme.getColorSchemeSelector('dark')]: {
      backgroundImage: "url('/assets/login/login-dark-theme.avif')"
    }
  })}
>
  <LoginRightPanel />
</Box>

      </Box>
    </CssVarsProvider>
  );
}