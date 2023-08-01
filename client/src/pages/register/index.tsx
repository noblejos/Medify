import { BaseUrl } from '@/config/baseUrl';
import User from '@/store/user.store';
import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    rem,
    Select,
    LoadingOverlay,
    Alert,
} from '@mantine/core';
import { useForm, zodResolver } from "@mantine/form";
import { IconAlertCircle } from '@tabler/icons-react';

import { setCookie } from 'cookies-next';
import { useQueryClient, useMutation } from '@tanstack/react-query'
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from "zod"

const createUser = async (data: RegisterForm) => {
    console.log(data)
    const { data: response } = await axios.post(`${BaseUrl}/auth/register`, data);
    return response.data;
};

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

const registerSchema = z.object({
    firstName: z.string().nonempty().min(4, { message: "First Name must be at least 4 character(s)" }),
    lastName: z.string().nonempty().min(4, { message: "First Name must be at least 4 character(s)" }),
    email: z.string().min(1, { message: "Email is required" }).email({
        message: "Must be a valid email",
    }),
    password: z
        .string({
            required_error: "Password is required",
        })
        .refine(
            (value) =>
                /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
                    value,
                ),
            `Password must contain at least 8 characters, 
    include at least one uppercase letter, 
    one lowercase letter, a number, and one special character`,
        ),
    gender: z.string().nonempty(),
})
export type RegisterForm = z.infer<typeof registerSchema>

const registerForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: ""
}

const data = [{ label: "Male", value: "male" }, { label: "Female", value: "female" }]

export default function Register() {
    const { classes } = useStyles();
    const queryClient = useQueryClient()
    const router = useRouter()

    const { setUser } = User();

    const [loading, setLoading] = useState(false)
    const [errorStr, setErrorStr] = useState("")

    const form = useForm<RegisterForm>({
        initialValues: registerForm,
        validate: zodResolver(registerSchema),
    });

    const { mutate, isLoading, isError, error } = useMutation(createUser, {
        onSuccess: data => {
            console.log(data);

            setCookie('auth', data.token, { maxAge: 60 * 6 * 24 });
            setUser({ ...data.user, token: data.token });
            router.push("/");
        },
        onError: (error) => {

            if (axios.isAxiosError(error)) {
                const data = error.response?.data;

                return setErrorStr(error?.response?.data.message);
            }
            console.log({ error })
            setErrorStr("Something went wrong while processing your request");
        },
        onSettled: () => {
            queryClient.invalidateQueries();
        }
    });

    const handleSubmit = async () => {
        form.validate()
        const { errors, values } = form;
        console.log({ error: errors, values: values })
        if (Object.keys(errors).length) return;
        mutate(values)
    }

    const handleChange = (fieldName: keyof RegisterForm, value: string | number) => {
        const updatedObject = { ...form.values, [fieldName]: value };
        form.setValues(updatedObject);
    };

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30} pos="relative">
                <LoadingOverlay visible={isLoading} />
                <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                    Welcome to Medify!
                </Title>
                {isError && (
                    <Alert
                        icon={<IconAlertCircle size="1rem" />}
                        title="An error occurred!"
                        color="red"
                        mb={30}
                        withCloseButton
                        closeButtonLabel="Close alert"
                        onClose={() => setErrorStr("")}
                    >
                        {errorStr}
                    </Alert>
                )}

                <TextInput label="First Name"
                    placeholder="Enter First Name"
                    mt="md"
                    size="md"
                    value={form.values.firstName}
                    onChange={(event) =>
                        handleChange("firstName", event.currentTarget.value)
                    }
                    error={form.errors.firstName} />
                <TextInput label="Last Name" placeholder="Enter Last Name" mt="md" size="md" value={form.values.lastName}
                    onChange={(event) =>
                        handleChange("lastName", event.currentTarget.value)
                    }
                    error={form.errors.lastName} />
                <TextInput label="Email address" placeholder="hello@gmail.com" mt="md" size="md" value={form.values.email} onChange={(event) =>
                    handleChange("email", event.currentTarget.value)
                }
                    error={form.errors.email} />
                <PasswordInput label="Password" placeholder="Your password" mt="md" size="sm" value={form.values.password} onChange={(event) =>
                    handleChange("password", event.currentTarget.value)
                }
                    error={form.errors.password} />
                <Select
                    label="Gender"
                    placeholder="select Gender"
                    searchable
                    mb={"lg"}
                    size='md'
                    mt="md"
                    searchValue={form.values.gender}
                    nothingFound="No options"
                    data={data}
                    onSearchChange={(event) =>
                        form.setFieldValue("gender", event.toLowerCase())
                    }
                    defaultValue={form.values.gender}
                    error={form.errors.gender}
                />



                <Button fullWidth mt="xl" size="md" fw={400} onClick={() => handleSubmit()}>
                    Register
                </Button>

                <Text ta="center" mt="md">
                    Already have an account?{' '}
                    <Anchor<'a'> href="/login" component='a' weight={500} >
                        Login
                    </Anchor>
                </Text>
            </Paper>
        </div >
    );
}