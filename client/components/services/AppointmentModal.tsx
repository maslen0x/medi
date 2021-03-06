import React from 'react'

import Modal, { ModalProps } from 'antd/lib/modal'
import Form, { FormProps } from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Agreement from '../app/Agreement'
import PhoneInput from '../app/PhoneInput'

export interface IAppointmentFormValues {
  name: string
  phone: string
}

interface IAppointmentModalProps extends ModalProps, FormProps<IAppointmentFormValues> {
  title: string
}

const AppointmentModal: React.FC<IAppointmentModalProps> = ({ title, visible, form, onCancel, onFinish }) => {
  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      width={530}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Ваше имя"
          name="name"
          rules={[{ required: true, message: 'Пожалуйста введите ваше имя!' }]}
        >
          <Input />
        </Form.Item>

        <PhoneInput />

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Записаться
          </Button>
        </Form.Item>

        <Agreement />
      </Form>
    </Modal>
  )
}

export default AppointmentModal