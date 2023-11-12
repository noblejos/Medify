

import { rem } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { LuLayoutDashboard } from "react-icons/lu"
import { BsLayoutTextSidebar } from "react-icons/bs"
import { VscGitPullRequestGoToChanges } from "react-icons/vsc"
import { ImProfile } from "react-icons/im"
import { FiUsers } from "react-icons/fi"
import { FaUserDoctor } from "react-icons/fa6"

export const userLinks = [
  {
    icon: (active: boolean) => (
      <LuLayoutDashboard
        size={20}
        mr={12}
        colors={{ primary: active ? "#1c1b23" : "#86858d" }}
      />
    ),
    label: "Dashboard",
    path: "/",
  },
  {
    icon: (active: boolean) => (
      <BsLayoutTextSidebar
        size={20}
        mr={12}
        colors={{ primary: active ? "#1c1b23" : "#86858d" }}
      />
    ),
    label: "Appointments",
    path: "/appointments",
  },
  {
    icon: (active: boolean) => (
      <VscGitPullRequestGoToChanges
        size={20}
        mr={12}
        colors={{ primary: active ? "#1c1b23" : "#86858d" }}
      />
    ),
    label: "Apply as Doctor",
    path: "/apply-doctor",
  },

];

export const doctorsLinks = [
  {
    icon: (active: boolean) => (
      <LuLayoutDashboard
        size={20}
        mr={12}
        colors={{ primary: active ? "#1c1b23" : "#86858d" }}
      />
    ),
    label: "Dashboard",
    path: "/",
  },
  {
    icon: (active: boolean) => (
      <BsLayoutTextSidebar
        size={20}
        mr={12}
        colors={{ primary: active ? "#1c1b23" : "#86858d" }}
      />
    ),
    label: "Appointments",
    path: "/doctor/appointments",
  },
  {
    icon: (active: boolean) => (
      <ImProfile
        size={20}
        mr={12}
        colors={{ primary: active ? "#1c1b23" : "#86858d" }}
      />
    ),
    label: "Profile",
    path: "/doctor/profile",
  },

];
export const adminLinks = [
  {
    icon: (active: boolean) => (
      <LuLayoutDashboard
        size={20}
        mr={12}
        colors={{ primary: active ? "#1c1b23" : "#86858d" }}
      />
    ),
    label: "Dashboard",
    path: "/",
  },
  {
    icon: (active: boolean) => (
      <FiUsers
        size={20}
        mr={12}
        colors={{ primary: active ? "#1c1b23" : "#86858d" }}
      />
    ),
    label: "Users",
    path: "/admin/users",
  },
  {
    icon: (active: boolean) => (
      <FaUserDoctor
        size={20}
        mr={12}
        colors={{ primary: active ? "#1c1b23" : "#86858d" }}
      />
    ),
    label: "Doctors",
    path: "/admin/doctors",
  },

];

