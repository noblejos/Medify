import withLayout from "@/layout/appLayout"
import User from "@/store/user.store";
import { Box, Container, Flex, Group, NumberInput, Text, TextInput, createStyles } from "@mantine/core"
import { useState } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from "axios";
import { BaseUrl } from "@/config/baseUrl";
import { getCookie } from "cookies-next";
import { useForm } from "@mantine/form";


const useStyles = createStyles((theme) => ({

}))

const token = getCookie("auth")

function DoctorProfile() {

    // const { classes } = useStyles;
    const queryClient = useQueryClient()
    const { user } = User()

    const [edit, setEdit] = useState(false)

    const form = useForm({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            specialization: "",
            experience: ""
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

    if (profile) {
        form.setFieldValue("firstName", profile.user.firstName)
    }

    return (
        <Container size={1400}>
            <Text mb={30}>Profile</Text>
            <form>
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
                        <TextInput

                            label="Specialization"
                            placeholder="Specialization"
                            {...form.getInputProps('specialization')}
                        />
                    </Box>
                    <Box w={"100%"} >
                        <TextInput

                            label="Experience"
                            placeholder=" Experience"
                            {...form.getInputProps('experience')}
                        />
                    </Box>
                    <Box w={"100%"} >
                        <NumberInput
                            type="number"
                            hideControls
                            label="Fee Per Consultation"
                            placeholder="Enter your fees"
                            {...form.getInputProps('consultationFee')}
                        />
                    </Box>
                </Flex>
            </form>

        </Container>
    )
}

export default withLayout(DoctorProfile, "Doctor Profile")