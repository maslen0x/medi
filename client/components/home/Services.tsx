import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Typography from 'antd/lib/typography'
import Card from 'antd/lib/card'

import { ICategory } from '../../types/categories'

interface IServicesProps {
  categories: ICategory[]
}

const Services: React.FC<IServicesProps> = ({ categories }) => {
  return categories.length ? <>
    <Typography.Title level={2}>Виды услуг</Typography.Title>
    <Row gutter={[16, 16]} className="services-types">
      {categories.map(category => (
        <Col key={category._id} md={8} sm={12} xs={24}>
          <Card
            hoverable
            className="services-types__card"
            cover={
              <Link href={`/search?cat=${category.name}`}>
                <a>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ENV_API_URL}/uploads/${category.image}`}
                    alt={`${category.name} ${category.description}`}
                    width={576}
                    height={324}
                    loading="eager"
                  />
                </a>
              </Link>
            }
          >
            <Card.Meta
              title={category.name}
              description={category.description}
            />
          </Card>
        </Col>
      ))}
    </Row>
  </> : null
}

export default Services