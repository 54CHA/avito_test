import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  List as ListIcon,
  BarChart,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useThemeContext } from '../../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { mode, toggleTheme } = useThemeContext();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Avito Модерация
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/list"
            startIcon={<ListIcon />}
            sx={{
              textDecoration: isActive('/list') ? 'underline' : 'none',
              fontWeight: isActive('/list') ? 'bold' : 'normal',
            }}
          >
            Объявления
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/stats"
            startIcon={<BarChart />}
            sx={{
              textDecoration: isActive('/stats') ? 'underline' : 'none',
              fontWeight: isActive('/stats') ? 'bold' : 'normal',
            }}
          >
            Статистика
          </Button>
        </Box>

        <Tooltip title={mode === 'light' ? 'Темная тема' : 'Светлая тема'}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
