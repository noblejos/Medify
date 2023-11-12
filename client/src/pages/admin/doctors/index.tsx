import withLayout from '@/layout/appLayout'
import { Badge, Button, Center, Container, Flex, Group, LoadingOverlay, Modal, Table, Text } from '@mantine/core'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { BaseUrl } from '@/config/baseUrl';
import { Td, Th } from '@/components/Table';
import { User } from '@/store/user.store';
import { GetServerSideProps } from 'next';
import dayjs from 'dayjs';
import { useDisclosure } from '@mantine/hooks';
import useNotification from '@/hooks/useNotification';

const token = getCookie("auth")

interface Doctor {
    user: User;
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


const Apply = async (data: any) => {
    const token = getCookie("auth")
    console.log(data)
    const { data: response } = await axios.post(`${BaseUrl}/admin/change-doctors-status`, data, {
        headers: {
            Authorization: "Bearer " + `${token}`,
        }
    });
    return response.data;
};

function DoctorsList() {

    const queryClient = useQueryClient()

    const [selectedDoctor, setSelectedDoctor] = useState<Doctor>()
    const [opened, { open, close }] = useDisclosure(false);

    const { handleError, handleSuccess } = useNotification()
    const [visible, setVisible] = useState(false)
    const [errorStr, setErrorStr] = useState("")

    const fetchUsers = async () => {
        const { data: response } = await axios.get(`${BaseUrl}/admin/doctors-list`, {
            headers: {
                Authorization: "Bearer " + `${token}`,
            }
        });
        return response.data;
    }
    const { isLoading, isError, data, error } = useQuery(["doctors-list"], fetchUsers)

    const { mutate, isLoading: loading, isError: err, error: e } = useMutation(Apply, {
        onSuccess: data => {
            handleSuccess("Success", "Application for Doctor role submitted successfully")
            // router.push("/");
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                return setErrorStr(error?.response?.data.message);
            }
            handleError("Error", "Something went wrong while processing your request")

        },
        onSettled: () => {
            setVisible(false)
            queryClient.invalidateQueries();
        }
    });


    const previewDoctor = (id: string) => {

        const selected = data.find((v: Doctor) => v.id === id)
        setSelectedDoctor(selected)
        open()
    }

    const review = (status: string) => {
        close()
        setVisible(true)
        const data = {
            doctorId: selectedDoctor?.id,
            status
        }
        mutate(data)
    }

    return (
        <Container size={"lg"} pos={"relative"}>
            <LoadingOverlay visible={visible} />
            <Text fz={22} fw={500} > Doctors List </Text>
            <Table
                horizontalSpacing="md"
                verticalSpacing="md"
                striped
                sx={{ tableLayout: "auto", }}
            >
                <thead>
                    <tr>
                        <Th
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
                                createdAt
                            </Text>
                        </Th>
                        <Th
                            sortable={false}
                        >
                            <Text fz={12} fw={600}>
                                status
                            </Text>
                        </Th>
                        <Th
                            sortable={false}
                            styles={{ width: "" }}
                        >
                            <Text fz={12} fw={600} >
                                Actions
                            </Text>
                        </Th>
                    </tr>
                </thead>
                <tbody >
                    {!isLoading && data.length > 0 ? (
                        data.map((doctor: Doctor, index: any) => (
                            <tr key={index}>
                                <Td styles={{ width: "80px" }}>
                                    <Text fw={400}>{index + 1}</Text>
                                </Td>
                                <Td>
                                    <Text fw={400} tt={"capitalize"} fz="sm">{`${doctor.user.firstName} ${doctor.user.lastName}`}</Text>
                                </Td>
                                <Td>
                                    <Text fw={400} fz="sm">{doctor.user.email}</Text>
                                </Td>
                                <Td>
                                    <Text fz="sm" fw={400} >{dayjs(doctor.createdAt).format("DD-MM-YYYY")}</Text>
                                </Td>
                                <Td>
                                    <Badge
                                        size="sm"
                                        variant="light"
                                        color={doctor?.status === "pending"
                                            ? "orange"
                                            : doctor?.status === "approved"
                                                ? "green"
                                                : "red"
                                        }
                                        radius="sm"
                                    >
                                        {doctor?.status}
                                    </Badge>
                                </Td>
                                <Td>
                                    <div>
                                        <Button size='xs' variant='outline' onClick={() => previewDoctor(doctor.id)} >Preview</Button>
                                    </div>
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
            <Modal size={"lg"} opened={opened} onClose={close}>
                <div>
                    <Flex justify={"space-between"}>
                        <div>
                            <Text fw={600}>First Name</Text>
                            <Text fz={13}>{selectedDoctor?.user.firstName}</Text>
                        </div>
                        <div>
                            <Text fw={600} ta="right">Last Name</Text>
                            <Text fz={13} ta="right">{selectedDoctor?.user.lastName}</Text>
                        </div>
                    </Flex>
                    <Flex mt={15} justify={"space-between"}>
                        <div>
                            <Text fw={600}>Specialization</Text>
                            <Text fz={13}>{selectedDoctor?.specialization}</Text>
                        </div>
                        <div>
                            <Text fw={600} ta="right">Experience</Text>
                            <Text fz={13} ta="right">{selectedDoctor?.experience}</Text>
                        </div>
                    </Flex>
                    <Flex mt={15} justify={"space-between"}>
                        <div>
                            <Text fw={600}>Consultation Fees</Text>
                            <Text fz={13} >&#x20A6;{selectedDoctor?.consultationFee}</Text>
                        </div>
                        <div>
                            <Text fw={600} >Consultation Timings</Text>
                            <Text fz={13} ta="right">{selectedDoctor?.timings.from}-{selectedDoctor?.timings.to}</Text>
                        </div>
                    </Flex>
                    <Flex mt={15} justify={"space-between"}>
                        <div>
                            <Text fw={600}>Address</Text>
                            <Text fz={13} >{selectedDoctor?.address}</Text>
                        </div>
                        <div>
                            <Text fw={600} >Status</Text>
                            <Text fz={13} ta="right">
                                <Badge
                                    size="sm"
                                    variant="light"
                                    color={selectedDoctor?.status === "pending"
                                        ? "orange"
                                        : selectedDoctor?.status === "approved"
                                            ? "green"
                                            : "red"
                                    }
                                    radius="sm"
                                >
                                    {selectedDoctor?.status}
                                </Badge>
                            </Text>
                        </div>
                    </Flex>
                    <Text mt={15} fw={600} >Medical License</Text>
                    <Center>
                        <img src={selectedDoctor?.license} alt="" style={{ width: "400px", height: "300px" }} />
                    </Center>
                    <Group position='apart' mb={20}>
                        <Button size='xs' variant='outline' onClick={() => review("rejected")} >
                            Reject
                        </Button>
                        <Button size='xs' onClick={() => review("approved")}>
                            Approve
                        </Button>
                    </Group>
                </div>

            </Modal>
        </Container>
    )
}

export default withLayout(DoctorsList, "Doctors-List")

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