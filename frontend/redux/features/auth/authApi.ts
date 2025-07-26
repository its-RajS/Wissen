import { apiSlice } from "../api/apiSlice";
import { userRegistration, userLoggedIn, userLoggedOut } from "./authSlice";

type IRegistrationResponse = {
  activationToken: string;
  message: string;
};

type IRegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    //endpoints here
    register: build.mutation<IRegistrationResponse, IRegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          dispatch(
            userRegistration({
              token: res.data.activationToken,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    activation: build.mutation({
      query: ({ activationToken, activationCode }) => ({
        url: "activateUser",
        method: "POST",
        body: {
          activationToken,
          activationCode,
        },
      }),
    }),
    login: build.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          dispatch(
            userLoggedIn({
              token: res.data.accessToken,
              user: res.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation } =
  authApi;
