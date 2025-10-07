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
                    minHeight: { md: 400 },
                    py: { xs: 5, md: 6 },
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    sx={{ minHeight: { md: 350 } }}
                >
                    {/* Image Section */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: { xs: 'center', md: 'flex-end' },
                                alignItems: 'center',
                                height: { xs: 'auto', md: '100%' },
                                mb: { xs: 4, md: 0 },
                                pr: { md: 2 }, // Add padding right on desktop
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: '70%', sm: '60%', md: '90%' },
                                    maxWidth: { xs: 280, md: 400 },
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
                        </Box>
                    </Grid>

                    {/* Content Section */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center', // Center-align all content
                                height: { xs: 'auto', md: '100%' },
                                textAlign: 'center', // Center-align text

                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: { xs: 1.5, md: 2 },
                                    color: '#f27b96',
                                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                                    lineHeight: { xs: 1.2, md: 1.3 },
                                }}
                            >
                                Convenience and Quality
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    mb: { xs: 2.5, md: 3 },
                                    lineHeight: 1.7,
                                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                                    color: 'text.secondary',
                                    maxWidth: 450,
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
                                    px: { xs: 3, md: 4 },
                                    py: { xs: 1.2, md: 1.5 },
                                    borderRadius: 2,
                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    minWidth: { xs: 140, md: 160 },
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