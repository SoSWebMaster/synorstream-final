import * as yup from 'yup';


export const contactSchema = yup.object().shape({
    name: yup.string().required('Name is Required').default(''),
    email: yup.string()
    .email('Invalid email format') // Checks for a valid email format
    .required('Email is required'), 
    phone:yup.string().required('Phone is required'),
    subject:yup.string().required('Subject is required'),
    comments: yup.string().required('Comments is required'),

  });
  