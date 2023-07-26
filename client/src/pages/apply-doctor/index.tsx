import FileUploader from '@/components/Dropzone';
import withLayout from '@/layout/appLayout';
import { TextInput, Checkbox, Button, Group, Box, Container, Text, Flex, Divider, rem, ActionIcon, NumberInput, createStyles } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconClock } from '@tabler/icons-react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { z } from 'zod';

const initialValues = {
    address: "",
    specialization: "",
    experience: "",
    consultationFee: 0,
    from: "",
    to: ""
}

const doctorForm = z.object({
    address: z.string().nonempty().min(4, { message: "Address must be at least 4 character(s)" }),
    specialization: z.string().nonempty(),
    experience: z.string().nonempty(),
    consultationFee: z.number({ invalid_type_error: "Consultation Fee must be a number" }).min(1000, "Consultation Fee must be greater than N1,000"),
    from: z.string().nonempty({ message: "Field is required" }),
    to: z.string().nonempty({ message: "Field is required" }),
})
export type RegisterForm = z.infer<typeof doctorForm>

const useStyles = createStyles((theme) => ({
    wrapper: {
        minHeight: rem(900),
        backgroundSize: 'cover',
        backgroundImage:
            'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
    },

    form: {
        borderRight: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
            }`,
        minHeight: rem(900),
        maxWidth: rem(550),
        paddingTop: rem(80),

        [theme.fn.smallerThan('sm')]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
}));

function ApplyDoctor() {
    const { classes, theme } = useStyles()

    const form = useForm<RegisterForm>({
        initialValues: initialValues,
        validate: zodResolver(doctorForm),
    });
    const from = useRef<HTMLInputElement>(null);
    const to = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File[] | null>(null);
    const [fileError, setFileError] = useState("")

    console.log({ file })

    const handleSubmit = async (values: RegisterForm) => {
        let fileUrl = null;
        const formData = new FormData();

        if (file !== null) {
            setFileError("")
            formData.append("file", file[0]);

            formData.append("upload_preset", "eifhxurctheuhwuqqyqsuanhquhwu");
            const response = await axios.post(`https://api.cloudinary.com/v1_1/greyhairedgallery/image/upload`, formData)

            fileUrl = response.data.url
        } else {
            setFileError("File is Required")
        }
        if (!fileUrl) return null;

        const data = {
            address: values.address,
            specialization: values.specialization,
            experience: values.experience,
            consultationFee: values.consultationFee,
            timings: [values.from, values.to],
            license: fileUrl
        }
        console.log({ data })
    }

    return (
        <Container size={1200}>
            <Text fz={22} fw={500} > Apply as Doctor </Text>
            <Divider my={10} />
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>

                <Text fz={16} fw={500} mb={20}> Professional Information </Text>
                <Group
                    mt={20}
                    sx={{
                        [theme.fn.smallerThan("md")]: {
                            flexDirection: "column",
                        },
                    }}
                >
                    <div>
                        <Text my={7} fw={400} fz={14}>Upload your Medical License</Text>
                        <FileUploader
                            file={file}
                            setFile={(file) => setFile(file)}
                            error={fileError}
                        />
                    </div>
                </Group>
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
                <Flex
                    mt={15}
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ sm: 'space-between' }}
                >

                </Flex>
                <Text mt={20} fz={15}>Select time for consultation</Text>
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ base: "", sm: '' }}
                >

                    <TimeInput
                        label="From"
                        ref={from}
                        rightSection={
                            <ActionIcon >
                                <IconClock size="1rem" stroke={1.5} onClick={() => from.current?.showPicker()} />
                            </ActionIcon>
                        }
                        w={{ md: "250px", sm: "100%" }}
                        {...form.getInputProps('from')}
                    />
                    <TimeInput
                        label="To"
                        ref={to}
                        rightSection={
                            <ActionIcon >
                                <IconClock size="1rem" stroke={1.5} onClick={() => to.current?.showPicker()} />
                            </ActionIcon>
                        }
                        w={{ md: "250px", sm: "100%" }}
                        {...form.getInputProps('to')}
                    />
                </Flex>
                <Divider my={20} />
                <Text fz={16} fw={500} my={25}> Personal Information </Text>

                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ sm: 'space-between' }}
                >
                    <Box w={"100%"}  >
                        <TextInput

                            label="Address"
                            placeholder="Enter your Address"
                            {...form.getInputProps('address')}
                        />
                    </Box>
                </Flex>


                <Group position='center' mt="xl">
                    <Button w={500} type="submit">Submit</Button>
                </Group>

            </form>
        </Container>


    );
}

export default withLayout(ApplyDoctor, "Apply Doctor")