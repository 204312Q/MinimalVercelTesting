'use client';

import { useState, useEffect } from "react";
import { format, parseISO, addDays } from "date-fns";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import { recoveryMenuPool, nourishMenuPool } from "src/_mock/_menu";
import { getMenuIndexesForDate } from "../../components/menu/getMenuIndexesForDate";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import NextLink from 'next/link';

const BASE_DATE = parseISO("2025-01-01");

export default function MenuPage() {
    const [startDate, setStartDate] = useState(new Date());
    const [startDateStr, setStartDateStr] = useState(format(new Date(), "yyyy-MM-dd"));
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [weekDays, setWeekDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDayByWeek, setSelectedDayByWeek] = useState({});
    const [menu, setMenu] = useState({ lunchDishes: [], dinnerDishes: [] });

    // Helper to get the date start
    const getActualWeekStart = (baseDate, weekIndex) => {
        return addDays(baseDate, (weekIndex - 1) * 7);
    };

    useEffect(() => {
        setSelectedWeek(1);
    }, []);

    useEffect(() => {
        const parsedStartDate = parseISO(startDateStr);
        const baseWeekStart = getActualWeekStart(parsedStartDate, selectedWeek);

        const rotatedWeek = [];
        let currentDate = baseWeekStart;

        for (let i = 0; i < 7; i++) {
            rotatedWeek.push({
                day: format(currentDate, "EEEE"),
                date: format(currentDate, "dd/MM/yyyy"),
                rawDate: currentDate
            });
            currentDate = addDays(currentDate, 1);
        }

        setWeekDays(rotatedWeek);

        if (selectedDayByWeek[selectedWeek]) {
            setSelectedDay(selectedDayByWeek[selectedWeek]);
        } else {
            const firstDay = rotatedWeek[0];
            setSelectedDay(firstDay);
            setSelectedDayByWeek((prev) => ({
                ...prev,
                [selectedWeek]: firstDay,
            }));
        }
    }, [startDate, selectedWeek]);

    useEffect(() => {
        if (!selectedDay) return;
        const { recoveryIndex, nourishIndex } = getMenuIndexesForDate(selectedDay.rawDate, []);
        const isRecoveryWeek = selectedWeek === 1;

        const menu = isRecoveryWeek
            ? recoveryMenuPool[recoveryIndex] ?? { lunchDishes: [], dinnerDishes: [] }
            : nourishMenuPool[nourishIndex] ?? { lunchDishes: [], dinnerDishes: [] };

        setMenu(menu);
    }, [selectedDay, selectedWeek, startDate]);

    return (
        <>
            <Box sx={{ mb: 4, p: 3, maxWidth: '48rem', mx: 'auto', bgcolor: 'white', boxShadow: 3, borderRadius: 2, border: '1px solid', borderColor: 'grey.200', textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, color: '#f27b96' }}>
                    Select Your Meal Start Date
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Select Start Date"
                            value={startDate}
                            onChange={(newValue) => {
                                if (!newValue) return;
                                setStartDate(newValue);
                                setStartDateStr(format(newValue, "yyyy-MM-dd"));
                                setSelectedWeek(1);
                                setSelectedDayByWeek({});
                            }}
                            format="dd/MM/yyyy"
                            slotProps={{
                                textField: {
                                    size: "medium",
                                    sx: { width: 256 },
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
                    {[1, 2, 3, 4].map((week) => (
                        <Button
                            key={week}
                            variant={selectedWeek === week ? "contained" : "outlined"}
                            onClick={() => setSelectedWeek(week)}
                            sx={{
                                flex: '1 0 22%',
                                display: 'flex',
                                flexDirection: 'column',
                                py: 2,
                                fontWeight: 'bold',
                                minWidth: 80,
                                backgroundColor: selectedWeek === week ? '#f27b96' : '#FACAD5',
                                color: selectedWeek === week ? '#fff' : '#f27b96',
                                borderColor: '#FACAD5',
                                '&:hover': {
                                    backgroundColor: selectedWeek === week ? '#e26782' : '#fce9ed',
                                },
                            }}
                        >
                            <span>Week {week}</span>
                            <span style={{ fontSize: 12, opacity: 0.8 }}>
                                {week === 1 ? "Recovery" : "Nourish"}
                            </span>
                        </Button>
                    ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
                    {weekDays.map((item) => (
                        <Button
                            key={item.date}
                            variant={selectedDay?.date === item.date ? "contained" : "outlined"}
                            onClick={() => {
                                setSelectedDay(item);
                                setSelectedDayByWeek((prev) => ({
                                    ...prev,
                                    [selectedWeek]: item,
                                }));
                            }}
                            sx={{
                                flex: '1 0 13%',
                                display: 'flex',
                                flexDirection: 'column',
                                py: 1,
                                minWidth: 60,
                                backgroundColor: selectedDay?.date === item.date ? '#f27b96' : 'transparent',
                                color: selectedDay?.date === item.date ? '#fff' : '#f27b96',
                                borderColor: '#f27b96',
                                '&:hover': {
                                    backgroundColor: selectedDay?.date === item.date ? '#e26782' : '#fce9ed',
                                },
                            }}
                        >
                            <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{item.day.slice(0, 3)}</span>
                            <span style={{ fontSize: 12 }}>{item.date}</span>
                        </Button>
                    ))}
                </Box>

                {selectedDay && (
                    <>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#f27b96' }}>
                            LONGAN RED DATE TEA SERVED WITH EVERY MEAL
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: ['column', 'row'], gap: 3, mt: 2 }}>
                            {["Lunch", "Dinner"].map((type) => (
                                <Paper key={type} elevation={3} sx={{ flex: 1, p: 3, textAlign: 'center', backgroundColor: '#FACAD5' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'extrabold', textTransform: 'uppercase', color: 'grey.900' }}>
                                        {type}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#f27b96' }}>
                                        {type === "Lunch" ? "午餐" : "晚餐"}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ textAlign: 'left' }}>
                                        {(type === "Lunch" ? menu.lunchDishes : menu.dinnerDishes).map((dish, index) => (
                                            <Box key={index} sx={{ mb: 2 }}>
                                                <Typography sx={{ fontWeight: 600, color: 'grey.900' }}>{dish.english}</Typography>
                                                <Typography sx={{ color: 'grey.700' }}>{dish.chinese}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </>
                )}
            </Box>
            <Box
                sx={{
                    px: { xs: 2, md: 10 },
                    textAlign: 'center',
                    borderRadius: 3,
                    mb: 6,
                }}
            >
                <Button
                    component={NextLink}
                    href="/order"
                    variant="contained"
                    sx={{
                        backgroundColor: '#f27b96',
                        color: '#fff',
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#e26782',
                        },
                    }}
                >
                    Order Now
                </Button>
            </Box>
        </>
    );
}