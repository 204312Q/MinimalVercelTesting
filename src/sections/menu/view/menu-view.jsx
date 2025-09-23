'use client';
import MenuCalendar from '../menu-calendar';
import { MenuHero } from '../menu-hero';
import { MenuPopular } from '../menu-popular';
import { MenuAddOn } from '../menu-addOn';

// ----------------------------------------------------------------------

export function MenuView() {
    return (
        <>
            <MenuHero />
            <MenuPopular />
            <MenuCalendar />
            <MenuAddOn />

        </>
    );
}
