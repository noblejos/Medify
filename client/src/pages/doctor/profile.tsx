import withLayout from "@/layout/appLayout"
import User from "@/store/user.store";
import { ActionIcon, Box, Button, Container, Flex, Group, NumberInput, Text, TextInput, createStyles } from "@mantine/core"
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from "axios";
import { BaseUrl } from "@/config/baseUrl";
import { getCookie } from "cookies-next";
import { isEmail, useForm } from "@mantine/form";
import { FORMERR } from "dns";
import { TimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import useNotification from "@/hooks/useNotification";
import { GetServerSideProps } from "next";

const token = getCookie("auth")

const Update = async (data: any) => {
    const token = getCookie("auth")
    console.log(data)
    const { data: response } = await axios.patch(`${BaseUrl}/doctor/update-doctor-profile`, data, {
        headers: {
            Authorization: "Bearer " + `${token}`,
        }
    });
    return response.data;
};

function DoctorProfile() {

    const queryClient = useQueryClient()
    const { user } = User()
    const { handleError, handleSuccess } = useNotification()

    const [errorStr, setErrorStr] = useState("")
    const [visible, setVisible] = useState(false)

    const from = useRef<HTMLInputElement>(null);
    const to = useRef<HTMLInputElement>(null);

    const [edit, setEdit] = useState(false)

    const form = useForm({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            specialization: "",
            experience: "",
            consultationFee: "",
            timings: {
                from: "",
                to: ""
            }
        }
    })

    const fetchDoctorDetails = async () => {
        const { data: response } = await axios.get(`${BaseUrl}/doctor/doctor-profile`, {
            headers: {
                Authorization: "Bearer " + `${token}`,
            }
        });
        return response.data;
    }

    const { isLoading, isError, data: profile, error } = useQuery(["doctor-details"], fetchDoctorDetails)


    const handleSubmit = async (values: any) => {
        setVisible(true)

        const data = {
            doctorId: profile.id,
            ...values
        }
        mutate(data)
    }

    const { mutate, isLoading: loading, isError: is_err, error: err } = useMutation(Update, {
        onSuccess: data => {
            handleSuccess("Success", "Application for Doctor role submitted successfully")

        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                return setErrorStr(error?.response?.data.message);
            }
            setErrorStr("Something went wrong while processing your request");
            handleError("Error", "Something went wrong while processing your request")

        },
        onSettled: () => {
            setVisible(false)
            setEdit(false)
            queryClient.invalidateQueries();
        }
    });


    useEffect(() => {
        if (!profile) return;
        form.setValues({
            firstName: profile.user.firstName,
            lastName: profile.user.lastName,
            email: profile.user.email,
            address: profile.address,
            specialization: profile.specialization,
            experience: profile.experience,
            consultationFee: profile.consultationFee,
            timings: {
                from: profile.timings.from,
                to: profile.timings.to
            }
        })
    }, [profile])

    return (
        <Container size={1400}>
            <Flex justify={"space-between"}>
                <Text mb={30} fw={700}>Profile</Text>
                {!edit &&
                    <Button onClick={() => setEdit(true)}>
                        Edit
                    </Button>}
            </Flex>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Text fz={15} fw={500}>Personal Information</Text>
                <Group grow>
                    <div>
                        <Text fz={13}>First Name</Text>
                        {!edit ? <Text mt={10} fz={13} c={"dimmed"}>{profile?.user.firstName}</Text>
                            :
                            <TextInput {...form.getInputProps("firstName")} />
                        }
                    </div>
                    <div>
                        <Text fz={13}>Last Name</Text>
                        {!edit ? <Text mt={10} fz={13} c={"dimmed"}>{profile?.user.lastName}</Text>
                            :
                            <TextInput {...form.getInputProps("lastName")} />
                        }
                    </div>
                </Group>
                <Box mt={13}>
                    <Text>Email</Text>
                    {!edit ? <Text mt={10} fz={13} c={"dimmed"}>{profile?.user.email}</Text>
                        :
                        <TextInput {...form.getInputProps("email")} />
                    }
                </Box>
                <Box mt={13}>
                    <Text>Address</Text>
                    {!edit ? <Text mt={10} fz={13} c={"dimmed"}>{profile?.address}</Text>
                        :
                        <TextInput {...form.getInputProps("address")} />
                    }
                </Box>
                <Text mt={20} fz={15} fw={500}>Professional Information</Text>
                <Flex
                    mt={15}
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ sm: 'space-between' }}
                >
                    <Box w={"100%"} >
                        <Text>Specialization</Text>
                        {!edit ?
                            <Text mt={10} fz={13} c={"dimmed"}>{profile?.specialization}</Text>
                            :
                            <TextInput
                                placeholder="Specialization"
                                {...form.getInputProps('specialization')}
                            />}
                    </Box>
                    <Box w={"100%"} >
                        <Text>Experience</Text>
                        {!edit ?
                            <Text mt={10} fz={13} c={"dimmed"}>{profile?.experience}</Text>
                            :
                            <TextInput
                                placeholder=" Experience"
                                {...form.getInputProps('experience')}
                            />}
                    </Box>
                    <Box w={"100%"} >
                        <Text>Consultation Fees (NGN)</Text>
                        {!edit ?
                            <Text mt={10} fz={13} c={"dimmed"}>{profile?.consultationFee}</Text>
                            :
                            <NumberInput
                                type="number"
                                hideControls
                                placeholder="Enter your fees"
                                {...form.getInputProps('consultationFee')}
                            />}
                    </Box>
                </Flex>
                <Text mt={20} fz={15}>Consultation Time</Text>
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ base: "", sm: '' }}
                >
                    <Box w={"300px"}>
                        <Text>From</Text>
                        {!edit ?
                            <Text mt={10} fz={13} c={"dimmed"}>{profile?.timings.from}</Text>
                            :
                            <TimeInput
                                ref={from}
                                rightSection={
                                    <ActionIcon >
                                        <IconClock size="1rem" stroke={1.5} onClick={() => from.current?.showPicker()} />
                                    </ActionIcon>
                                }
                                w={{ md: "250px", sm: "100%" }}
                                {...form.getInputProps('timings.from')}
                            />}
                    </Box>
                    <Box w={"300px"}>
                        <Text>To</Text>
                        {!edit ?
                            <Text mt={10} fz={13} c={"dimmed"}>{profile?.timings.to}</Text>
                            :
                            <TimeInput
                                ref={from}
                                rightSection={
                                    <ActionIcon >
                                        <IconClock size="1rem" stroke={1.5} onClick={() => from.current?.showPicker()} />
                                    </ActionIcon>
                                }
                                w={{ md: "250px", sm: "100%" }}
                                {...form.getInputProps('timings.to')}
                            />}
                    </Box>
                </Flex>
                {edit &&
                    <Group mt={25} position="apart">
                        <Button onClick={() => setEdit(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Submit
                        </Button>
                    </Group>}
            </form>

        </Container>
    )
}

export default withLayout(DoctorProfile, "Doctor Profile")

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