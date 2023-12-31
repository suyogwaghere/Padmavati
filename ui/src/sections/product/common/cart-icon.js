import PropTypes from 'prop-types';
// @mui
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export default function CartIcon({ totalItems }) {
  return (
    <Box
      component={RouterLink}
      href={paths.dashboard.product.checkout}
      sx={{
        right: 20,
        bottom: 30,
        zIndex: 999,
        display: 'flex',
        cursor: 'pointer',
        position: 'fixed',
        color: 'text.primary',
        borderRadius: 2,
        // borderBottomLeftRadius: 16,
        bgcolor: 'background.paper',
        padding: (theme) => theme.spacing(2, 3, 1, 2),
        boxShadow: (theme) => theme.customShadows.dropdown,
        transition: (theme) => theme.transitions.create(['opacity']),
        '&:hover': { opacity: 0.65 },
      }}
    >
      <Badge showZero badgeContent={totalItems} color="error" max={99}>
        <Iconify icon="solar:cart-3-bold" width={24} />
      </Badge>
    </Box>
  );
}

CartIcon.propTypes = {
  totalItems: PropTypes.number,
};
