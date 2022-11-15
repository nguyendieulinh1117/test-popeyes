import React from "react";
import classNames from "classnames";
import * as Yup from "yup";
import Select from 'react-select';

import InputTextField from "@@@Form/InputTextField";
import Button from "@@@Form/Button";
import BasicForm from "@@@Form/BasicForm";
import RadioBoxField from "@@@Form/RadioBoxField";

import IconArrow from '@assets/icons/arrow.svg';


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const DemoFrom = () => {
    const onAddressFormSubmit = (value: any) => {
    }
    const onUpdate = (value: any) => {
    }

    const [selectedOption, setSelectedOption] = React.useState(null);

    const radioData = [
        {
            label: 'Thanh toán khi nhận hàng (COD)',
            value: '1',
        },
        {
            label: 'Chuyển khoảng qua ngân hàng',
            value: '2',
        }
    ]
    return (
        <div style={{ maxWidth: '500px', margin: "0 auto" }}>
            <div className="container">
                <BasicForm
                    initialValues={{
                        firstName: 'nguyen tuan anh',
                        note: 'content',
                    }}
                    validationSchema={Yup.object({
                        firstName: Yup.string().required('loi'),
                        note: Yup.string().required('loi'),
                    })}
                    onSubmit={onAddressFormSubmit}
                >
                    <>
                        <InputTextField
                            label="Họ và tên"
                            placeholder="Nhập họ và tên "
                            name="firstName"
                            required
                            iconLeft={<IconArrow />}
                            iconRight={<IconArrow />}
                        // disabled
                        hideErrorMessage = {false}

                        />
                        <InputTextField
                            textarea={true}
                            label="Ghi chú"
                            placeholder="Nhập ghi chú "
                            name="note"
                            required
                            rows={5}
                        // iconLeft = {<IconArrow/>}
                        // iconRight = {<IconArrow/>}
                        // disabled
                        hideErrorMessage = {false}

                        />
                        <Select
                            defaultValue={selectedOption}
                            onChange={() => setSelectedOption}
                            options={options}
                            classNamePrefix={'prefix'}
                            name={'type'}
                        />
                        <RadioBoxField 
                            items={radioData} 
                            name="gender" 
                            onUpdate = {onUpdate}
                        />
                        <Button  type="submit">send</Button>
                    </>
                </BasicForm>
            </div>
        </div >
    );
}

export default DemoFrom;