import withLayout from '@/layout/appLayout'
import { Badge, Button, Container, Flex, LoadingOverlay, Table, Text } from '@mantine/core'
import React from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { BaseUrl } from '@/config/baseUrl';
import { Td, Th } from '@/components/Table';
import Link from 'next/link';
import { User } from '@/store/user.store';
import dayjs from "dayjs";
import { GetServerSideProps } from 'next';
import useNotification from '@/hooks/useNotification';

const token = getCookie("auth")

interface IAppointment {
    patient: User,
    doctor: any,
    status: string,
    dateTime: Date,
    id: string
}

const updateStatus = async (data: any) => {
    const { data: response } = await axios.patch(`${BaseUrl}/doctor/change-appointment-status/${data.id}`, { status: data.status }, {
        headers: {
            Authorization: "Bearer " + `${token}`,
        }
    });

    return response;
}

function DoctorsAppointment() {

    const queryClient = useQueryClient();

    const { handleSuccess, handleError } = useNotification()

    const fetchUsers = async () => {
        const { data: response } = await axios.get(`${BaseUrl}/doctor/fetch-appointments`, {
            headers: { Authorization: "Bearer " + `${token}` }
        });
        return response.data;
    }
    const { isLoading, isError, data, error } = useQuery(["appointment-list"], fetchUsers)

    const { mutate, isLoading: load, isError: hasErr, error: erro } = useMutation(updateStatus, {
        onSuccess: data => {

            handleSuccess("Appointment", data.message)
        },
        onError: (error: any) => {
            if (axios.isAxiosError(error)) {
                handleError("Appointment", "Encountered an Error");
                return;
            }
            handleError("Appointment", "Encountered an Error");

        },
        onSettled: () => {
            queryClient.invalidateQueries();
        }
    });

    const handleUpdateStatus = (status: string, id: string) => {
        mutate({ status, id })
    }


    return (
        <Container size={"lg"} pos={"relative"} mih={"90vh"}>
            <LoadingOverlay visible={load} />
            <Text fz={22} fw={500} mb={30} > Appointments </Text>
            <Table
                horizontalSpacing="md"
                verticalSpacing="md"
                striped
                sx={{ tableLayout: "auto", }}
            >
                <thead>
                    <tr>
                        <Th
                            styles={{ width: "50px" }}
                            sortable={false}
                        >
                            <Text fz={12} fw={600}>
                                S/n
                            </Text>
                        </Th>
                        <Th
                            sortable={false}
                        >
                            <Text fz={12} fw={600}>
                                Name
                            </Text>
                        </Th>
                        <Th
                            sortable={false}
                        >
                            <Text fz={12} fw={600}>
                                Email
                            </Text>
                        </Th>
                        <Th
                            sortable={false}
                        >
                            <Text fz={12} fw={600}>
                                Date & Time
                            </Text>
                        </Th>
                        <Th
                            sortable={false}
                        >
                            <Text fz={12} fw={600}>
                                Status
                            </Text>
                        </Th>
                        <Th
                            sortable={false}
                        >
                            <Text fz={12} fw={600}>
                                Action
                            </Text>
                        </Th>

                    </tr>
                </thead>
                <tbody >
                    {!isLoading && data.length > 0 ? (
                        data.map((item: IAppointment, index: any) => (
                            <tr key={index}>
                                <Td styles={{ width: "80px" }}>
                                    <Text fw={400}>{index + 1}</Text>
                                </Td>
                                <Td>
                                    <Text fw={400} tt={"capitalize"} fz="sm">{`${item.patient.firstName} ${item.patient.lastName}`}</Text>
                                </Td>
                                <Td>
                                    <Text fw={400} fz="sm">{item.patient.email}</Text>
                                </Td>
                                <Td>
                                    <Text fz="sm" fw={400} >{dayjs(item.dateTime).format("YYYY-MM-DD HH:mm")}</Text>
                                </Td>
                                <Td>
                                    <Text fz="sm" fw={400} >
                                        <Badge
                                            size="sm"
                                            variant="light"
                                            color={item?.status === "pending"
                                                ? "orange"
                                                : item?.status === "approved"
                                                    ? "green"
                                                    : "red"
                                            }
                                            radius="sm"
                                        >
                                            {item?.status}
                                        </Badge>
                                    </Text>
                                </Td>
                                <Td>
                                    <Flex align='center' gap={10}>
                                        <Button size='xs' w={80} onClick={() => handleUpdateStatus("approve", item.id)}> Approve</Button>
                                        <Button size='xs' variant='outline' w={80} onClick={() => handleUpdateStatus("reject", item.id)}> Reject</Button>
                                    </Flex>
                                </Td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>
                                {/* <NoDataComponent
                                    title="You have no Recent Auth."
                                    image={
                                        <Image
                                            src={emptyIcon.src}
                                            alt="invoice"
                                            width={100}
                                            height={100}
                                            mb={20}
                                        />
                                    }
                                /> */}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    )
}

export default withLayout(DoctorsAppointment, "Appointments")


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { req } = ctx;
    const authToken = req.cookies.auth;

    if (!authToken) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    try {
        const responses = await Promise.all([
            axios.get(`${BaseUrl}/auth/me`, {
                headers: { Authorization: `Bearer ${authToken}` },
            })
        ]);

        const user = responses[0].data.data;
        return { props: { data: { user } } };
    } catch (error: any) {
        console.log(error.response)
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
};