import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuthContext from '../contexts/AuthContext';
import { Box, Icon, IconEnum, theme } from '../Jet';


const EXCLUDED_PATHS = ['/'];
const icons = [
  {
    path: '/scripts',
    icon: IconEnum.menu,
  },
  {
    path: '/last_chat',
    icon: IconEnum.chat_filled,
  }
];

const FooterStyle = styled(Box).attrs((props: any) => props)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3.6rem;
  background-color: ${theme.colors.background[1]};
  border-top: 1px solid ${theme.colors.background[3]};
  padding: 1rem 2rem;
`;


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();


  if (EXCLUDED_PATHS.includes(location.pathname) || !user)
    return null;

  return (
    <FooterStyle alignItems="center" justifyContent="space-between">
      {icons.map(({ path, icon }) => (
          <Icon
            key={path}
            icon={icon}
            size={32}
            color={location.pathname === path ? theme.colors.primary[0] : theme.colors.text[9]}
            onClick={() => navigate(path)}
            style={{ cursor: 'pointer' }}
          />
      ))}
    </FooterStyle>
  );
}

export default Navbar;
