import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import withLayout from '@/layout/appLayout'

import { ActionIcon, Button, Card, Divider, Flex, Grid, Modal, Text } from '@mantine/core'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BaseUrl } from '@/config/baseUrl'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import User, { User as UsersInterface } from '@/store/user.store'
import dayjs from 'dayjs'
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import { DateInput, DatePickerInput, TimeInput } from '@mantine/dates'
import { IconClock } from '@tabler/icons-react'
dayjs.extend(customParseFormat);

interface Doctor {
  user: UsersInterface;
  status: string;
  address: string;
  consultationFee: number;
  experience: string;
  specialization: string;
  timings: {
    from: string;
    to: string
  };
  id: string;
  createdAt: string;
  license: string
}

const inter = Inter({ subsets: ['latin'] });

const token = getCookie("auth");

function Home() {
  const { user } = User();

  const queryClient = useQueryClient();

  const ref = useRef<HTMLInputElement>(null);


  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>()

  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState("")

  const fetchDoctorDetails = async () => {
    const { data: response } = await axios.get(`${BaseUrl}/auth/fetch-doctors`, {
      headers: {
        Authorization: "Bearer " + `${token}`,
      }
    });
    return response.data;
  }

  const { isLoading, isError, data: doctors, error } = useQuery(["doctor-details"], fetchDoctorDetails);

  const formatTime = (time: string) => {
    return dayjs(time, "HH:mm").format("HH:mm");
  }

  const handleBookAppointment = (id: string) => {
    setSelectedDoctor(doctors.find((doctor: Doctor) => doctor.id == id));
    open()

  }

  const timeInput = document.getElementById("time") as HTMLInputElement;

  useEffect(() => {

    if (timeInput) {
      timeInput.setAttribute("min", "09:00");
    }
  }, [])


  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main} ${inter.className}`}>

        <Grid gutter="xl">
          {
            doctors?.length && doctors.map((doctor: Doctor) => (
              <Grid.Col span={4}>
                <Card shadow="sm" padding="lg" radius="md" sx={{
                  border: "1px solid #05cfff"
                }} >
                  <Text tt="capitalize" fw={600} fz={16}>{`Dr. ${doctor.user.firstName} ${doctor.user.lastName}`}</Text>
                  <Text fz={14} fw={600} c={"#05cfff"}>{doctor.specialization}</Text>
                  <Divider />
                  <Flex gap={20} mt={15}>
                    <Text fz={14} fw={500} c={"dimmed"} w={150}>Experience</Text>
                    <Text fz={14} >{doctor.experience}</Text>
                  </Flex>
                  <Flex gap={20} mt={15}>
                    <Text fz={14} fw={500} c={"dimmed"} w={150}>Emal</Text>
                    <Text fz={14} >{doctor.user.email}</Text>
                  </Flex>
                  <Flex gap={20} mt={15}>
                    <Text fz={14} fw={500} c={"dimmed"} w={150}>Fees per visit</Text>
                    <Text fz={14} >&#8358;{doctor.consultationFee}</Text>
                  </Flex>
                  <Flex gap={20} mt={15}>
                    <Text fz={14} fw={500} c={"dimmed"} w={150}>Consultation Time</Text>
                    <Text fz={14} >{`${doctor.timings.from} - ${doctor.timings.to}`}</Text>
                  </Flex>
                  {user?.role == "user" && <Button radius="xs" mt={20} onClick={() => handleBookAppointment(doctor.id)} size='xs'>Book Appointment</Button>}
                </Card>
              </Grid.Col>
            ))
          }
        </Grid>
        <Modal centered size={"lg"} title="Book Appointment" opened={opened} onClose={close}>
          <Card p={20}>
            <Text tt="capitalize" fw={600} fz={16}>{`Dr. ${selectedDoctor?.user.firstName} ${selectedDoctor?.user.lastName}`}</Text>
            <Text fz={14} fw={600} c={"#05cfff"}>{selectedDoctor?.specialization}</Text>

            <Text fz={14} mt={20} >{`${formatTime(selectedDoctor?.timings.from as string)} - ${formatTime(selectedDoctor?.timings.to as string)}`}</Text>
            <Divider mt={15} />
            <Text mt={10} fz={14}> Select Your Slot</Text>

            <form onSubmit={(e) => e.preventDefault()}>
              <DatePickerInput
              // value={value}
                onChange={(e => setDate(e))}
                dropdownType="modal"
              minDate={new Date()}
              label="Select Date"
                placeholder="Date input"
                size='xs'
                mt={'md'}
              />
              <TimeInput
                label="Current time"
                withAsterisk
                min="9:00"
                size='xs'
                id='time'
                ref={ref}
                rightSection={
                  <ActionIcon onClick={() => ref.current?.showPicker()}>
                    <IconClock size="1rem" stroke={1.5} />
                  </ActionIcon>
                }
                mt={'md'}
              />
              <Button mt={'md'} type='submit'>Check Availability</Button>
            </form>
          </Card>


        </Modal>
      </main>
    </>
  )
}

export default withLayout(Home, "Home")