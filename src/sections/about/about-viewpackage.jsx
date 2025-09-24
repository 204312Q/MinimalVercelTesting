'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Image from 'next/image';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function AboutViewPackage({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={[
                () => ({
                    height: { md: 560 },
                    py: { xs: 10, md: 0 },
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Container>
                <Grid container spacing={4} alignItems="center">
                    {/* Left side - Image */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                src="/aboutUs/confinementPackage.avif"
                                alt="Confinement Package"
                                width={400}
                                height={300}
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: 12,
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* Right side - Content */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                color: 'white',
                                textAlign: 'center', // Center the text on all screen sizes
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 3,
                                    color: '#f27b96',
                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                }}
                            >
                                Convenience and Quality
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 4,
                                    lineHeight: 1.8,
                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                    color: 'primary.darker',
                                }}
                            >
                                Our thermal wares deliver warm, nutritious meals straight to your doorstep.
                                <br /><br />
                                Skip meal prep, cooking, and cleaning—spend quality time with your newborn while we take care of your well-being.
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#f27b96',
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#e26782',
                                    },
                                }}
                            >
                                View Packages
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}