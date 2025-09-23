'use client';
import Box from '@mui/material/Box';
import Image from 'next/image';

// ----------------------------------------------------------------------

export function MenuAddOn({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={{
                width: '100vw', // Take full viewport width
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                pb: { xs: 4, md: 8 },
                bgcolor: 'white',
                ...sx,
            }}
            {...other}
        >
            <Box
                sx={{
                    width: '100vw',
                    minHeight: { xs: 180, sm: 300, md: 400 },
                    position: 'relative',
                    borderRadius: 0,
                    overflow: 'hidden',
                }}
            >
                <Image
                    src="/aboutUs/cpc-dish.png"
                    alt="Dish Banner"
                    fill
                    style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                    }}
                    sizes="100vw"
                />
            </Box>
        </Box>
    );
}