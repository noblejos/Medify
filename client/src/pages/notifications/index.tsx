import { Tabs, Card, Text, Flex, createStyles } from '@mantine/core';


import withLayout from "@/layout/appLayout"
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { BaseUrl } from '@/config/baseUrl';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Notification {
    header: string,
    message: string,
    status: string,
    role: string,
    user: string,
    clickPath: string
}

const useStyles = createStyles((theme) => ({
    card: {
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        border: "1px solid grey",
        padding: "7px 10px",
        "&:hover": {
            backgroundColor: "#FAFAFA",
            color: "#fff",

        },
    }
}));

function Notification() {
    const { classes } = useStyles();

    const queryClient = useQueryClient()

    const token = getCookie("auth")

    const fetchNotifications = async () => {
        const { data: response } = await axios.get(`${BaseUrl}/notifications`, {
            headers: {
                Authorization: "Bearer " + `${token}`,
            }
        });
        return response.data;
    }
    const { isLoading, isError, data: notifications, error } = useQuery(["notifications"], fetchNotifications)
    console.log({ notifications })
    let seen;
    let unSeen;

    if (notifications) {
        seen = notifications?.filter((notification: Notification) => notification.status === "seen")
        console.log({ seen })
        unSeen = notifications?.filter((notification: Notification) => notification.status === "unseen")
        console.log({ unSeen })
    }


    return (
        <div>
            <Tabs keepMounted={false} defaultValue="unseen">
                <Tabs.List>
                    <Tabs.Tab value="unseen">Unseen</Tabs.Tab>
                    <Tabs.Tab value="seen">Seen</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="unseen">
                    {unSeen?.map((item: Notification, index: number) => (

                        <Card key={index}>
                            <Flex className={classes.card}>
                                <Text c="black" component='a' href={`${item.clickPath}`}>{item.message} <Text fw={400} component='span'>--- click to preview</Text></Text>
                            </Flex>
                        </Card>
                    ))}
                </Tabs.Panel>
                <Tabs.Panel value="seen">
                    {seen?.map((item: Notification, index: number) => (
                        <Card key={index}>
                            <Flex className={classes.card}>
                                <Text c="black">{item.message} <Text fw={400} component='span'>--- click to preview</Text></Text>
                            </Flex>
                        </Card>
                    ))}
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}
export default withLayout(Notification, "Notification")