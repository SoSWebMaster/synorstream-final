import * as yup from 'yup';


export const musicSchema = yup.object().shape({
    name: yup.string().required('Name is Required').default(''),
    email: yup.string()
    .email('Invalid email format') // Checks for a valid email format
    .required('Email is required') ,
    music_link: yup.string()
    .url('Invalid URL format') // Ensures the value is a valid URL
    .required('Music link is required'), 
    bio:yup.string().required('Bio is required'),

  });
  