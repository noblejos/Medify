import withLayout from '@/layout/appLayout'
import { Badge, Button, Container, Table, Text } from '@mantine/core'
import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { BaseUrl } from '@/config/baseUrl';
import { Td, Th } from '@/components/Table';
import Link from 'next/link';
import { User } from '@/store/user.store';
import dayjs from "dayjs";
import { GetServerSideProps } from 'next';

const token = getCookie("auth")

function UsersList() {

    const queryClient = useQueryClient();

    const fetchUsers = async () => {
        const { data: response } = await axios.get(`${BaseUrl}/admin/users-list`, {
            headers: { Authorization: "Bearer " + `${token}` }
        });
        return response.data;
    }
    const { isLoading, isError, data, error } = useQuery(["users-list"], fetchUsers)
    console.log({ data })

    console.log(isLoading, data)

    return (
        <Container size={"lg"}>
            <Text fz={22} fw={500} > Users List </Text>
            <Table
                // withBorder
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
                                createdAt
                            </Text>
                        </Th>
                        <Th
                            sortable={false}
                        >
                            <Text fz={12} fw={600}>
                                Actions
                            </Text>
                        </Th>

                    </tr>
                </thead>
                <tbody >
                    {!isLoading && data.length > 0 ? (
                        data.map((user: User, index: any) => (
                            <tr key={index}>
                                <Td styles={{ width: "80px" }}>
                                    <Text fw={400}>{index + 1}</Text>
                                </Td>
                                <Td>
                                    <Text fw={400} tt={"capitalize"} fz="sm">{`${user.firstName} ${user.lastName}`}</Text>
                                </Td>
                                <Td>
                                    <Text fw={400} fz="sm">{user.email}</Text>
                                </Td>
                                <Td>
                                    <Text fz="sm" fw={400} >{dayjs(user.createdAt).format("DD-MM-YYYY")}</Text>
                                </Td>
                                <Td>
                                    <div>
                                        <Button size='xs'>
                                            Block
                                        </Button>
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
        </Container>
    )
}

export default withLayout(UsersList, "Users-List")


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