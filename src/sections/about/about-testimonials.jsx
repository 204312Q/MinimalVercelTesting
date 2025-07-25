'use client';
import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Grid from '@mui/material/Grid2';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';

import { _testimonials } from 'src/_mock';
import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutTestimonials({ sx, ...other }) {
  const renderLink = () => (
    <Button color="primary" endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
      Read more
    </Button>
  );

  const renderDescription = () => (
    <Box sx={{ maxWidth: { md: 360 }, textAlign: { xs: 'center', md: 'unset' } }}>
      <m.div variants={varFade('inUp')}>
        <Typography variant="overline" sx={{ color: 'common.white', opacity: 0.48 }}>
          Testimonials
        </Typography>
      </m.div>

      <m.div variants={varFade('inUp')}>
        <Typography variant="h2" sx={{ my: 3, color: 'common.white' }}>
          Who loved <br />
          our Meals
        </Typography>
      </m.div>

      <m.div variants={varFade('inUp')}>
        <Typography sx={{ color: 'common.white' }}>
          We bring convenience with our array of nourishing confinement dishes delivered right to your doorstep, allowing you the luxury of spending quality time with your newborn and family, as well as ensuring you get adequate rest for your postpartum recovery!
        </Typography>
      </m.div>

      <Box
        component={m.div}
        variants={varFade('inUp')}
        sx={{ mt: 3, justifyContent: 'center', display: { xs: 'flex', md: 'none' } }}
      >
        {renderLink()}
      </Box>
    </Box>
  );

  const renderContent = () => (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.hideScrollY,
          py: { md: 10 },
          height: { md: 1 },
          overflowY: { xs: 'unset', md: 'auto' },
        }),
      ]}
    >
      <Masonry spacing={3} columns={{ xs: 1, md: 2 }} sx={{ ml: 0 }}>
        {_testimonials.map((testimonial) => (
          <m.div key={testimonial.name} variants={varFade('inUp')}>
            <TestimonialItem testimonial={testimonial} />
          </m.div>
        ))}
      </Masonry>
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.7)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.6)})`,
              `url(${CONFIG.assetsDir}/assets/background/aboutus.png)`,
            ],
          }),
          overflow: 'hidden',
          height: { md: 840 },
          py: { xs: 10, md: 0 },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container component={MotionViewport} sx={{ position: 'relative', height: 1 }}>
        <Grid
          container
          spacing={3}
          sx={{
            height: 1,
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'space-between' },
          }}
        >
          <Grid size={{ xs: 10, md: 4 }}>{renderDescription()}</Grid>

          <Grid size={{ xs: 12, md: 7, lg: 6 }} sx={{ height: 1, alignItems: 'center' }}>
            {renderContent()}
          </Grid>
        </Grid>

        <Box
          component={m.div}
          variants={varFade('inUp')}
          sx={{ bottom: 60, position: 'absolute', display: { xs: 'none', md: 'flex' } }}
        >
          {renderLink()}
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function TestimonialItem({ testimonial, sx, ...other }) {
  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgBlur({ color: varAlpha(theme.vars.palette.common.whiteChannel, 0.08) }),
          p: 3,
          gap: 3,
          display: 'flex',
          borderRadius: 2,
          color: 'common.white',
          flexDirection: 'column',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify icon="mingcute:quote-left-fill" width={40} sx={{ opacity: 0.48 }} />
      <Typography variant="body2">{testimonial.content}</Typography>
      <Box sx={{ gap: 2, display: 'flex' }}>

        <ListItemText
          primary={testimonial.name}
          primaryTypographyProps={{ typography: 'subtitle2', mb: 0.5 }}
          secondaryTypographyProps={{
            color: 'inherit',
            typography: 'caption',
            sx: { opacity: 0.64 },
          }}
        />
      </Box>
    </Box>
  );
}
