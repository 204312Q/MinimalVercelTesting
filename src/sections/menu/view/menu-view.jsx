'use client';
import MenuCalendar from '../menu-calendar';
import { MenuHero } from '../menu-hero';
import { MenuPopular } from '../menu-popular';
import { MenuNextStep } from '../menu-next-steps';

// ----------------------------------------------------------------------

export function MenuView() {
    return (
        <>
            {/* <MenuHero /> */}
            <MenuPopular />
            <MenuCalendar />
            <MenuNextStep />
        </>
    );
}
