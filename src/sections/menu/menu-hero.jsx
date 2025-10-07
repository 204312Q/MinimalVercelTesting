'use client';
import Box from '@mui/material/Box';
import Image from 'next/image';

// ----------------------------------------------------------------------

export function MenuHero({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={{
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                pb: { xs: 4, md: 8 },
                bgcolor: 'white',
                overflow: 'hidden',
                ...sx,
            }}
            {...other}
        >
            {/* Top Image */}
            <Box
                sx={{
                    width: '100vw',
                    height: { xs: 180, sm: 220, md: 400 }, // Reduced heights to match image ratio
                    position: 'relative',
                    borderRadius: 0,
                    overflow: 'hidden',
                }}
            >
                <Image
                    src="/banners/Confinement_Menu_Banner.avif"
                    alt="Dish Banner"
                    fill
                    // Remove this line: priority
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    sizes="100vw"
                />
            </Box>
        </Box>
    );
}