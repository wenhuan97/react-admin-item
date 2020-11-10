import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqRemoveImg } from '../../api'
import { DEFAUT_IMG } from '../../utils/const'

// 用于图片上传的组件

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {

    state = {
        previewVisible: false,//标识是否显示 大图预览
        previewImage: '',//大图的 url
        fileList: [
            // {
            //     uid: '-1',//每个file都有自己唯一的id
            //     name: 'image.png',//图片文件名
            //     status: 'done',//图片的状态 done上传完成 Uploading上传中 removed已删除
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//地址
            // },

        ],
    };
    constructor(props) {

        super(props)
        // const { imgs } = this.props
        const { imgs } = this.props
        // console.log(imgs)
        let fileList = []

        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, i) => ({
                uid: -i,//每个file都有自己唯一的id
                name: img,//图片文件名
                status: 'done',//图片的状态 done上传完成 Uploading上传中 removed已删除
                url: DEFAUT_IMG + img
            }))
        }

        this.state = {
            previewVisible: false,//标识是否显示 大图预览
            previewImage: '',//大图的 url
            fileList//所有已上传图片的数组
        }
    }

    // 获取所有已上传图片 name的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        // 触发这个函数 会显示指定file对应 的大图
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };
    // 隐藏模态框
    // file 当前操作的图片文件（上传/删除）
    // fileList 所有已上传的图片文件 对象的数组
    handleChange = async ({ file, fileList }) => {
        console.log('handleChange()', file.status);

        //    上传成功后修改file中 name和url 这俩个值不对
        if (file.status === 'done') {
            const result = file.response//{status:0,data:{name:'xxx.jpg',url:'图片地址'}}
            if (result.status === 0) {
                message.success('图片上传成功')
                const { name, url } = result.data
                const file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传失败！')
            }
        } else if (file.status === 'removed') {
            const result = await reqRemoveImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功了~')
            } else {
                message.error('删除图片失败')
            }
        }

        // 在操作（上传/删除）过程中 更新fileList状态
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload"//上传图片的接口地址
                    accept="image/*" //只接受图片类型的文件
                    listType="picture-card"//上传完图片的内建样式
                    name="image"//请求参数名
                    fileList={fileList}//所有已上传图片文件对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton} {/*限制上出图片的个数*/}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}


// 子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件 子组件就可以调用
//父组件调用子组件的方法：在父组件中调用ref得到子组件的标签对象（也就是组件对象）调用其方法
